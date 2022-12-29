import Cmp from './base-component';
import * as Validation from '../util/validation';
import { autobind as Autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

// ProjectInput Class
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement> {
  $titleInput: HTMLInputElement;
  $descriptionInput: HTMLInputElement;
  $peopleInput: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.element.id = 'user-input';

    this.$titleInput = this.element.querySelector('#title') as HTMLInputElement;
    this.$descriptionInput = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.$peopleInput = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.$titleInput.value;
    const enteredDescription = this.$descriptionInput.value;
    const enteredPeople = this.$peopleInput.value;

    const titleValidatabel: Validation.Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatabel: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatabel: Validation.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !Validation.validate(titleValidatabel) ||
      !Validation.validate(descriptionValidatabel) ||
      !Validation.validate(peopleValidatabel)
    ) {
      alert('Invalid input, please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.$titleInput.value = '';
    this.$descriptionInput.value = '';
    this.$peopleInput.value = '';
  }
}
