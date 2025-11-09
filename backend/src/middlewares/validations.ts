import { Joi as _joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'
import joiDate from "@joi/date";
const Joi = _joi.extend(joiDate) as typeof _joi;


// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^(\+\d+)?(?:\s|-?|\(?\d+\)?)+$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

enum validationParams {
    MIN_EMAIL = 5,
    MAX_EMAIL = 128,
    MAX_PASSWORD = 2048,
    MIN_PASSWORD = 6,
    MIN_NAME = 2,
    MAX_NAME = 30,
    MAX_INT_NUM_COUNT = 8,
    MAX_SEARCH_LEN = 32,
    MAX_DESCRIPTION_LEN = 1024,
    MAX_SHORT_WORD_LEN = 16,
    MAX_LIMIT_PAGINATION = 20,
    MAX_PAGE_PAGINATION=100
}

const stringIsNumber = (value: string, helpers: _joi.CustomHelpers) => {
    if (
        isNaN(Number(value)) ||
        !isFinite(Number(value)) ||
        value.length > validationParams.MAX_INT_NUM_COUNT
    ) {
        return helpers.message({ custom: 'невалидное число' })
    }
    return value
}

const customMaxNumberAsString = ({
    min,
    max,
}: {
    min: number
    max: number
}) => {
    return function (value: string, helpers: _joi.CustomHelpers) {
        const num = Number(value)

        if (
            isNaN(num) ||
            !isFinite(num) ||
            value.length > validationParams.MAX_INT_NUM_COUNT ||
            !(num >= min && num <= max)
        ) {
            return helpers.message({ custom: 'невалидное число' })
        }
        return value
    }
}

// валидация id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .messages({
                'array.empty': 'Не указаны товары',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().min(5).max(128).email().required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string()
            .min(5)
            .max('+7-(999)-999-99-99'.length)
            .required()
            .pattern(phoneRegExp)
            .messages({
                'string.empty': 'Не указан телефон',
            }),
        address: Joi.string().required().min(1).max(512).messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'Не указана сумма заказа',
        }),
        comment: Joi.string().optional().allow('').max(512),
    }),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required().max(128),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().min(1).max(64).messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string()
            .required()
            .min(1)
            .max(validationParams.MAX_DESCRIPTION_LEN)
            .messages({
                'string.empty': 'Поле "description" должно быть заполнено',
            }),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required().max(128),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().max(64),
        description: Joi.string().max(validationParams.MAX_DESCRIPTION_LEN),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validatePatchUser = celebrate({
    body: Joi.object().keys({
        name: Joi.string()
            .min(validationParams.MIN_NAME)
            .max(validationParams.MAX_NAME)
            .messages({
                'string.min': 'Минимальная длина поля "name" - 2',
                'string.max': 'Максимальная длина поля "name" - 30',
            }),
        password: Joi.string()
            .min(validationParams.MIN_PASSWORD)
            .max(validationParams.MAX_PASSWORD)
            .messages({
                'string.empty': 'Поле "password" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
        email: Joi.string()
            .min(validationParams.MIN_EMAIL)
            .max(validationParams.MAX_EMAIL)
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
    }),
})

export const validateLoginUser = celebrate({
    body: Joi.object().keys({
        password: Joi.string()
            .required()
            .min(validationParams.MIN_PASSWORD)
            .max(validationParams.MAX_PASSWORD)
            .messages({
                'string.empty': 'Поле "password" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
        email: Joi.string()
            .required()
            .min(validationParams.MIN_EMAIL)
            .max(validationParams.MAX_EMAIL)
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
    }),
})

export const validateRegisterUser = celebrate({
    body: Joi.object().keys({
        name: Joi.string()
            .required()
            .min(validationParams.MIN_NAME)
            .max(validationParams.MAX_NAME)
            .messages({
                'string.min': 'Минимальная длина поля "name" - 2',
                'string.max': 'Максимальная длина поля "name" - 30',
            }),
        password: Joi.string()
            .required()
            .min(validationParams.MIN_PASSWORD)
            .max(validationParams.MAX_PASSWORD)
            .messages({
                'string.empty': 'Поле "password" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
        email: Joi.string()
            .required()
            .min(validationParams.MIN_EMAIL)
            .max(validationParams.MAX_EMAIL)
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
    }),
})

export const getCustomerValidation = celebrate({
    query: Joi.object().keys({
        limit: Joi.string().min(1).max(3).custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_LIMIT_PAGINATION})),
        page: Joi.string()
            .min(1)
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_PAGE_PAGINATION})),
        sortField: Joi.string().max(validationParams.MAX_SHORT_WORD_LEN),
        sortOrder: Joi.string().max(validationParams.MAX_SHORT_WORD_LEN),
        registrationDateFrom: Joi.date().format('YYYY-MM-DD').max(Date.now()),
        registrationDateTo: Joi.date().format('YYYY-MM-DD')
            .max(Date.now()),
        lastOrderDateFrom: Joi.date().format('YYYY-MM-DD').max(Date.now()),
        lastOrderDateTo: Joi.date().format('YYYY-MM-DD')
            .max(Date.now()),
        totalAmountFrom: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        totalAmountTo: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        orderCountFrom: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        orderCountTo: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        search: Joi.string().max(validationParams.MAX_SEARCH_LEN),
    }),
})

export const validatePatchCustomer = celebrate({
    body: Joi.object().keys({
        name: Joi.string()
            .min(validationParams.MIN_NAME)
            .max(validationParams.MAX_NAME)
            .messages({
                'string.min': 'Минимальная длина поля "name" - 2',
                'string.max': 'Максимальная длина поля "name" - 30',
            }),
        password: Joi.string()
            .min(validationParams.MIN_PASSWORD)
            .max(validationParams.MAX_PASSWORD)
            .messages({
                'string.empty': 'Поле "password" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
        email: Joi.string()
            .min(validationParams.MIN_EMAIL)
            .max(validationParams.MAX_EMAIL)
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
                'string.max': 'Валидация не прошла',
            }),
        lastOrderDate: Joi.date().format('YYYY-MM-DD').max(Date.now()),
        totalAmount: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        orderCount: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
    }),
})

export const getOrdersValidation = celebrate({
    query: Joi.object().keys({
        limit: Joi.string().min(1).max(3).custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_LIMIT_PAGINATION})),
        page: Joi.string()
            .min(1)
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 1, max: validationParams.MAX_PAGE_PAGINATION})),
        sortField: Joi.string().max(validationParams.MAX_SHORT_WORD_LEN),
        sortOrder: Joi.string().max(validationParams.MAX_SHORT_WORD_LEN),
        status: Joi.string().max(validationParams.MAX_SHORT_WORD_LEN),
        totalAmountFrom: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        totalAmountTo: Joi.string()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: Number.MAX_SAFE_INTEGER})),
        orderDateFrom: Joi.date().format('YYYY-MM-DD').max(Date.now()),
        orderDateTo: Joi.date().format('YYYY-MM-DD')
            .max(Date.now()),
        search: Joi.string().max(validationParams.MAX_SEARCH_LEN),
    }),
})

export const getOrdersCurrentUserValidation = celebrate({
    query: Joi.object().keys({
        limit: Joi.string().min(1).max(3).custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_LIMIT_PAGINATION})),
        page: Joi.string()
            .min(1)
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_PAGE_PAGINATION})),
        search: Joi.string().max(validationParams.MAX_SEARCH_LEN),
    }),
})

export const validationOrderByNumber = celebrate({
    params: Joi.object().keys({
        orderNumber: Joi.string()
            .required()
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(stringIsNumber),
    }),
})

export const validationProducts = celebrate({
    query: Joi.object().keys({
        page: Joi.string()
            .min(1)
            .max(validationParams.MAX_INT_NUM_COUNT)
            .custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_PAGE_PAGINATION})),
        limit: Joi.string().min(1).max(3).custom(customMaxNumberAsString({min: 0, max: validationParams.MAX_LIMIT_PAGINATION})),
    }),
})
