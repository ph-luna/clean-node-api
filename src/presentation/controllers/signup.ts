import { Controller } from '../protocols/controller'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helpers/http.helper'
import { EmailValidator } from '../protocols/emailValidator'

import { MissingParamError } from './../errors/missingParamsError'
import { InvalidParamError } from '../errors/invalidParamsError'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return {
        statusCode: 400,
        body: new InvalidParamError('email')
      }
    }

    return { statusCode: 200, body: {} }
  }
}
