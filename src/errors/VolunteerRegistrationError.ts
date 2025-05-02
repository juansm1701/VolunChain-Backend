export class VolunteerRegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VolunteerRegistrationError';
  }
}

export class VolunteerPositionFullError extends VolunteerRegistrationError {
  constructor() {
    super('Volunteer position is full');
    this.name = 'VolunteerPositionFullError';
  }
}

export class VolunteerAlreadyRegisteredError extends VolunteerRegistrationError {
  constructor() {
    super('User is already registered for this volunteer position');
    this.name = 'VolunteerAlreadyRegisteredError';
  }
}

export class VolunteerNotFoundError extends VolunteerRegistrationError {
  constructor() {
    super('Volunteer position not found');
    this.name = 'VolunteerNotFoundError';
  }
}

export class UserVolunteerService {
  // ... rest of the class implementation
} 