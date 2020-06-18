'use strict';

const ModelTypeSelector = class ModelTypeSelector {
  constructor(modelTypeButtons) {
    this.modelTypeButtons = modelTypeButtons;
    this.modelTypeButtons.forEach(modelTypeButton => {
      this.registerButtonEvent(modelTypeButton);
    });
    this.selectedStyleClass = modelTypeButtons[0].className;
    this.deselectedStyleClass = modelTypeButtons[1].className;
    this.currentButton = modelTypeButtons[0];
    this.onModelTypeChange = null;
  }

  // This will need to be changed as front end has changed
  registerButtonEvent(modelTypeButton) {
    modelTypeButton.addEventListener(
      'click',
      event => this.handleButtonClick(modelTypeButton),
      false
    );
  }

  handleButtonClick(modelTypeButton) {
    console.log('button clicked:', modelTypeButton);
    this.setSelectedButton(modelTypeButton);
  }

  setSelectedButton(modelTypeButton) {
    if (modelTypeButton == this.currentButton) {
      return;
    }
    this.modelTypeButtons.forEach(otherModelTypeButton => {
      if (otherModelTypeButton == modelTypeButton) {
        otherModelTypeButton.className = this.selectedStyleClass;
      } else {
        otherModelTypeButton.className = this.deselectedStyleClass;
      }
    });
    this.currentButton = modelTypeButton;
    if (this.onModelTypeChange != null) {
      this.onModelTypeChange(modelTypeButton.value);
    }
  }
};

export { ModelTypeSelector as default };
