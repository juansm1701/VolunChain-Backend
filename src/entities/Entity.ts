export abstract class Entity<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = props;
  }
} 