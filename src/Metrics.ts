export class Metrics {

  private values: Metric[];

  constructor(data: any) {
    this.values = [];
    //TODO load data if available
  }
  storeValue(name:string, value: number) {
    const metric = new Metric(name, value);

    this.values.push(metric);
  }
}

export class Metric {

  readonly name: string;
  readonly timestamp: number;
  readonly value: number;

  tags?: string[];

  constructor(name: string, value: number) {
    this.timestamp = Date.now(),
    this.name = name;
    this.value = value;
  }

  getPayload() {
    const data = {
      name: this.name,
      timestamp: this.timestamp,
      value: this.value
    };

    if (this.tags && this.tags.length > 0) {
      data['tags'] = this.tags;
    }

    return data;
  }
}