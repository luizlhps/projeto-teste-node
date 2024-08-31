import { ConfirmMeasureInputDto } from './../dtos/confirm-measure-input.dto';
import FileType from 'file-type';
import isBase64 from 'is-base64';
import { inject, injectable } from 'inversify';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4, validate } from 'uuid';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { IMeasureFilter } from 'src/shared/filters/measure-filter';
import { Measure_type } from '@prisma/client';
import { BadRequestException } from 'src/shared/exceptions/bad-request-exception';
import { ConflictException } from 'src/shared/exceptions/conflict-exception';
import { NotFoundException } from 'src/shared/exceptions/not-found-exeption';
import { ICustomerService, IMeasureService } from '../interfaces/_index';
import { IMeasureRepository } from 'src/infrastructure/interfaces/_index';
import { environment } from 'src/web/server';
import { NewMeasureOutputDto } from '../dtos/new-measure-output.dto';
import { NewMeasureInputDto } from '../dtos/new-measure-input.dto';
import { CustomerGetDto } from '../dtos/customer-get.dto';
import { Customer } from 'src/domain/entites/_index';
import { CustomerCreateDto } from '../dtos/customer-create.dto';
import { MeasureCreateDto } from '../dtos/measure-create.dto';
import { ConfirmMeasureOutputDto } from '../dtos/confirm-measure-output.dto';
import { MeasureUpdateDto } from '../dtos/measure-update.dto';
import { TYPES } from '@infrastructure/di-types';

@injectable()
export class MeasureService implements IMeasureService {
  private _measureRepository: IMeasureRepository;
  private _customerService: ICustomerService;
  private _genAI: GoogleGenerativeAI;
  private _fileManager: GoogleAIFileManager;

  public constructor(
    @inject(TYPES.measureRepository) measureRepository: IMeasureRepository,
    @inject(TYPES.customerService) customerService: ICustomerService,
  ) {
    this._measureRepository = measureRepository;
    this._customerService = customerService;

    this._genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY as string);
    this._fileManager = new GoogleAIFileManager(environment.GEMINI_API_KEY as string);
  }

  async newMeasure(newMeasureInputDto: NewMeasureInputDto): Promise<NewMeasureOutputDto> {
    //validar data
    if (
      typeof newMeasureInputDto.measure_datetime !== 'string' ||
      isNaN(Date.parse(newMeasureInputDto.measure_datetime))
    ) {
      throw new BadRequestException('Data inválida.', 'INVALID_DATA');
    }

    //validação do tipo
    const allowedTypes = [Measure_type.GAS, Measure_type.WATER];

    if (newMeasureInputDto?.measure_type && !allowedTypes.includes(newMeasureInputDto?.measure_type)) {
      throw new BadRequestException('Tipo de medição não permitida', 'INVALID_TYPE');
    }

    //validação cliente
    if (
      !newMeasureInputDto.customer_code ||
      typeof newMeasureInputDto.customer_code !== 'string' ||
      newMeasureInputDto.customer_code.trim().length === 0
    ) {
      throw new BadRequestException('O código do cliente é obrigatório e não pode estar vazio.', 'INVALID_DATA');
    }

    const base64String = newMeasureInputDto.image;

    // validar o base64
    if (!isBase64(base64String)) {
      throw new BadRequestException('A string não é um Base64 válido.', 'INVALID_DATA');
    }

    const buffer = Buffer.from(base64String, 'base64');
    const type = await FileType.fromBuffer(buffer);

    //verifica se os tipos são os mesmos suportados pelo gemini
    /*  PNG - image / png;
        JPEG - image / jpeg;
        WEBP - image / webp;
        HEIC - image / heic;
        HEIF - image / heif;  */

    const validImageExtensions = ['png', 'jpeg', 'jpg', 'webp', 'heic', 'heif'];

    if (!validImageExtensions.includes(type?.ext as string)) {
      throw new BadRequestException(
        'Formato de imagem inválido. Somente PNG, JPEG, WEBP, HEIC ou HEIF são suportados.',
        'INVALID_DATA',
      );
    }

    //verifica se ja existe leitura naquele mes
    const measureFilter: IMeasureFilter = {
      measure_datetime: newMeasureInputDto.measure_datetime,
    };

    const measuresList = await this._measureRepository.getAll(measureFilter);

    if (measuresList.length > 0) {
      throw new ConflictException('Leitura do mês já realizada', 'DOUBLE_REPORT');
    }

    //checa se existe esse customer
    const customerGetDto: CustomerGetDto = {
      customer_code: newMeasureInputDto.customer_code,
    };

    const customerExist = await this._customerService.findbyCode(customerGetDto);

    let customer: Customer;

    if (!customerExist) {
      const customerCreate: CustomerCreateDto = {
        customer_code: newMeasureInputDto.customer_code,
      };

      customer = await this._customerService.save(customerCreate);
    } else {
      customer = {
        ...customerExist,
        customer_code: customerExist.customer_code,
        id: customerExist.id,
      };
    }

    // salvar arquivo localmente
    const fileName = `${uuidv4()}.${type?.ext}`;
    const filePath = path.join('./uploads', fileName);

    try {
      await fs.promises.writeFile(filePath, buffer);

      //configurações da ia
      const model = this._genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt =
        'me passe o valor dessa conta, você pode encontrar esse valor com o numero com R$, apenas me passe o numero sem o R$ por exemplo você encontrou um valor R$200.20 me retorne esse valor, porem em 200.20';

      //salva a imagem no gemini
      const uploadResponse = await this._fileManager.uploadFile(filePath, {
        mimeType: type?.mime as string,
        displayName: uuidv4(),
      });

      //procuro a imagem e mando falar o valor da conta
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        {
          text: prompt,
        },
      ]);

      const measureCreate: MeasureCreateDto = {
        image_url: uploadResponse.file.uri,
        measure_uuid: uploadResponse.file.displayName as string,
        measure_datetime: newMeasureInputDto.measure_datetime,
        measure_type: newMeasureInputDto.measure_type,
        customer_id: customer.id,
        measure_value: parseFloat(result.response.text().replace(',', '.')),
      };

      const measureCreated = await this._measureRepository.save(measureCreate);

      // apaga o arquivo local
      await fs.promises.unlink(filePath);

      const newMeasureOutputDto: NewMeasureOutputDto = {
        image_url: measureCreated.image_url,
        measure_uuid: measureCreated.measure_datetime.toString(),
        measure_value: measureCreated.measure_value,
      };

      return newMeasureOutputDto;
    } catch (error) {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      throw error;
    }
  }

  async confirmMeasure(confirmMeasureInputDto: ConfirmMeasureInputDto): Promise<ConfirmMeasureOutputDto> {
    if (typeof confirmMeasureInputDto.measure_uuid !== 'string' || !validate(confirmMeasureInputDto.measure_uuid)) {
      throw new BadRequestException('O campo measure_uuid é inválido.', 'INVALID_DATA');
    }

    if (typeof confirmMeasureInputDto.confirmed_value !== 'number' || isNaN(confirmMeasureInputDto.confirmed_value)) {
      throw new BadRequestException('O valor confirmado deve ser um número válido.', 'INVALID_DATA');
    }

    if (confirmMeasureInputDto.confirmed_value < 0) {
      throw new BadRequestException('O valor confirmado não pode ser negativo.', 'INVALID_DATA');
    }

    const measureExist = await this._measureRepository.findbyUuid(confirmMeasureInputDto.measure_uuid);

    if (!measureExist) {
      throw new NotFoundException('Leitura não encontrada.', 'MEASURE_NOT_FOUND');
    }

    if (measureExist.has_confirmed) {
      throw new ConflictException('Leitura do mês já realizada.', 'CONFIRMATION_DUPLICATE');
    }

    const measureUpdateDto: MeasureUpdateDto = {
      measure_uuid: confirmMeasureInputDto.measure_uuid,
      measure_value: confirmMeasureInputDto.confirmed_value,
    };

    const measureUpdated = await this._measureRepository.update(measureUpdateDto);

    const confirmMeasureOutputDto: ConfirmMeasureOutputDto = {
      success: true,
    };

    return confirmMeasureOutputDto;
  }

  async listMeasures() {
    /*  console.log('exec'); */
    /* return await this.measureRepository.getAll(); */
  }
}
