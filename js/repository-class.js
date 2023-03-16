export class Repository {
  constructor(data) {
    this.login = data.owner.login;
    this.name = data.name;
    this.description = data.description;
    this.language = data.language;
    this.url = data['html_url'];
  }
}
