import { BaseCollection, field } from 'tordojs'

export class User extends BaseCollection {
  @field()
  name: string

  @field()
  country: string

  @field()
  pictureUrl: string
}
