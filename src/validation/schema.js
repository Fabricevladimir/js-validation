/** @module schema */

import * as Rules from "./rules";
import { SCHEMA, ERROR_MESSAGES as Errors } from "./constants";
import { validateType, isNumber, isString, isEmptyString } from "./utils";

/************************************
 *        Symbolic Constants
 ************************************/
const DEFAULT_RULES = {
  minimum: {
    value: SCHEMA.DEFAULT_MIN,
    ...Rules.getMinLengthRule(SCHEMA.DEFAULT_MIN),
  },
  maximum: {
    value: SCHEMA.DEFAULT_MAX,
    ...Rules.getMaxLengthRule(SCHEMA.DEFAULT_MAX),
  },
};

/************************************
 *        Class Declaration
 ************************************/

/**
 * Creates a new Schema
 *
 * @example
 * const schema = new Schema();
 */
export default class Schema {
  /**
   * The object detailing the validation rules to be tested for.
   * @private
   * @static
   * @type {object}
   */
  #schema = { rules: { ...DEFAULT_RULES } };

  /**
   * Set the minimum number of characters the property should contain.
   * @param {number} value - The minimum length.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   * @throws {TypeError} when value is not a number.
   * @throws {RangeError} when value is negative.
   *
   * @example
   * const schema = new Schema().min(4);
   */
  min(value, customError) {
    validateLength(value);

    this.#schema.rules.minimum = { ...Rules.getMaxLengthRule(value) };

    if (customError) {
      this.#schema.rules.minimum.error = customError;
    }
    return this;
  }

  /**
   * Get the minimum number of characters the property should contain.
   * @readonly
   * @type {number}
   *
   * @example
   * const schema = new Schema().min(4).max(7);
   * const minLength = schema.minimum; // 4
   */
  get minimum() {
    return this.#schema.rules.minimum.value;
  }

  /**
   * Set the maximum number of characters the property should contain.
   * @param {number} value - The maximum length.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   * @throws {TypeError} when value is not a number.
   * @throws {RangeError} when value is negative.
   *
   * @example
   * const schema = new Schema().max(4);
   */
  max(value, customError) {
    validateLength(value);

    this.#schema.rules.maximum = { ...Rules.getMaxLengthRule(value) };

    if (customError) {
      this.#schema.rules.maximum.error = customError;
    }
    return this;
  }

  /**
   * Get the maximum number of characters the property should contain.
   * @readonly
   * @type {number}
   *
   * @example
   * const schema = new Schema().min(4).max(7);
   * const maxLength = schema.maximum; // 7
   */
  get maximum() {
    return this.#schema.rules.maximum.value;
  }

  /**
   * Set property to contain at least one digit.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().hasDigit();
   */
  hasDigit(customError) {
    this.#schema.rules.digit = { ...Rules.DIGIT };

    if (customError) {
      this.#schema.rules.digit.error = customError;
    }

    return this;
  }

  /**
   * Return whether property should contain at least one digit.
   * @readonly
   * @type {boolean}
   *
   * @example
   * const schema = new Schema().min(4).hasDigit();
   * const hasDigit = schema.digit; // true
   */
  get digit() {
    return this.#schema.rules.digit ? true : false;
  }

  /**
   * Set property to contain at least one special character.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().hasSymbol();
   */
  hasSymbol(customError) {
    this.#schema.rules.symbol = { ...Rules.SYMBOL };

    if (customError) {
      this.#schema.rules.symbol.error = customError;
    }

    return this;
  }

  /**
   * Return whether property should contain at least
   * one special character.
   *
   * @readonly
   * @type {boolean}
   *
   * @example
   * const schema = new Schema().min(4).hasSymbol();
   * const hasSpecialCharacter = schema.symbol; // true
   */
  get symbol() {
    return this.#schema.rules.symbol ? true : false;
  }

  /**
   * Set property to contain at least one uppercase character
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().hasUppercase();
   */
  hasUppercase(customError) {
    this.#schema.rules.uppercase = { ...Rules.UPPERCASE };

    if (customError) {
      this.#schema.rules.uppercase.error = customError;
    }
    return this;
  }

  /**
   * Return whether property should contain at least
   * one uppercase character.
   *
   * @readonly
   * @type {boolean}
   *
   * @example
   * const schema = new Schema().min(4).hasUppercase();
   * const hasUppercase = schema.uppercase; // true
   */
  get uppercase() {
    return this.#schema.rules.uppercase ? true : false;
  }

  /**
   * Set property to contain at least one lowercase character
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().hasLowercase();
   */
  hasLowercase(customError) {
    this.#schema.rules.lowercase = { ...Rules.LOWERCASE };

    if (customError) {
      this.#schema.rules.uppercase.error = customError;
    }
    return this;
  }

  /**
   * Return whether property should contain at least
   * one lowercase character.
   *
   * @readonly
   * @type {boolean}
   *
   * @example
   * const schema = new Schema().min(4).hasLowercase();
   * const hasLowercase = schema.lowercase; // true
   */
  get lowercase() {
    return this.#schema.rules.lowercase ? true : false;
  }

  /**
   * Set label to be pre-appended to the property's
   * validation error messages
   *
   * @param {string} name
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().label("abc");
   */
  label(name) {
    validateStringInput(name, "Label");

    this.#schema.label = name;
    return this;
  }

  /**
   * Get property label.
   * @readonly
   * @type {string}
   *
   * @example
   * const schema = new Schema().min(4).label("def");
   * const name = schema.alias; // def
   */
  get alias() {
    return this.#schema.label;
  }

  /**
   * Set property to be validated as an email address.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().isEmail();
   */
  isEmail(customError) {
    this.#schema.rules.email = { ...Rules.EMAIL };

    if (customError) {
      this.#schema.rules.email.error = customError;
    }
    return this;
  }

  /**
   * Get whether property is an email.
   * @readonly
   * @type {boolean}
   *
   * @example
   * const schema = new Schema().min(4).isEmail();
   * const schemaIsEmail = schema.email; // true
   */
  get email() {
    return this.#schema.rules.email ? true : false;
  }

  /**
   * Set property to be validated.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   *
   * @example
   * const schema = new Schema().isRequired();
   */
  isRequired(customError) {
    this.#schema.required = customError ? customError : Rules.REQUIRED.error;
    return this;
  }

  /**
   * Return whether property should be validated.
   * @readonly
   * @type {boolean}
   *
   * @example
   * const schema = new Schema().min(4).isRequired();
   * const isRequired = schema.required; // true
   */
  get required() {
    return this.#schema.required ? true : false;
  }

  /**
   * Set property validation to match the value of given property name.
   * @param {string} name - The matching property name.
   * @param {string} [customError] - Custom error message.
   * @return {Schema} The current schema instance.
   * @throws {TypeError} When the name is not a string.
   * @throws Throws an error the name is an empty string.
   *
   * @example
   * const schema = new Schema().matches("password");
   */
  matches(name, customError) {
    validateStringInput(name, "Matching property");

    this.#schema.matchingProperty = name;
    const { error } = Rules.getMatchesRule("", this.#schema.matchingProperty);

    this.#schema.rules.matchingProperty = customError
      ? { error: customError }
      : { error };
    return this;
  }

  /**
   * Get the name of the matching property.
   * @readonly
   * @type {string}
   *
   * @example
   * const schema = new Schema().min(4).matches("abc");
   * const property = schema.matchingProperty; // abc
   */
  get matchingProperty() {
    return this.#schema.matchingProperty;
  }

  /**
   * Determines whether schema is configured properly and is called
   * automatically by the validate function.
   * @see {@link validation.js} for further information.
   *
   * @returns {object} New object containing the schema rules.
   * @throws When minimum length is greater than maximum length
   * @throws When minimum or maximum length is less than the number
   *         of required characters.
   */
  validateSchema() {
    const { label, rules, required, matchingProperty } = this.#schema;
    const { minimum, maximum } = rules;

    // Ignore everything else
    if (matchingProperty) {
      return {
        label,
        required,
        matchingProperty,
        rules: [rules.matchingProperty],
      };
    }

    // Ignore everything else
    if (rules.email) {
      return { label, required, rules: [rules.email] };
    }

    // Get 'required characters' - ex: hasSymbol set to true means
    // that the minimum value must be at least one in order to match the
    // symbol rule.
    // Note that min and max are included by default
    const requiredChars =
      Object.keys(rules).length - Object.keys(DEFAULT_RULES).length;

    // Set minimum to the least number of required characters if
    // it was not set explicitly

    if (minimum.value === SCHEMA.DEFAULT_MIN) {
      const minRule = {
        ...Rules.getMinLengthRule(requiredChars),
      };
      minimum.value = requiredChars;
      minimum.error = minRule.error;
      minimum.pattern = minRule.pattern;
    }

    // min greater than max
    if (minimum.value > maximum.value) {
      throw new Error(Errors.INVALID_MIN_OVER_MAX);
    }

    // more characters than min/max length
    if (maximum.value < requiredChars || minimum.value < requiredChars) {
      throw new Error(Errors.INVALID_MIN_MAX);
    }

    // values not needed anymore
    delete rules.minimum.value;
    delete rules.maximum.value;

    // Return rules as array
    return { ...this.#schema, rules: Object.values(rules) };
  }
}

/************************************
 *         Helper Functions
 ************************************/

/**
 * Validate minimum and maximum number of characters.
 * @param {number} value The value to be validated.
 * @returns {void} Nothing.
 * @throws {TypeError} When the given value is not a number.
 * @throws {RangeError} When the length is negative.
 */
function validateLength(value) {
  validateType(value, isNumber);

  // Validate range
  if (value < SCHEMA.DEFAULT_MIN) {
    throw new RangeError(Errors.INVALID_NUMBER);
  }
}

/**
 * Validate property names.
 * @param {string} value - The value to be validated.
 * @param {string} propertyName - The property name being validated.
 * @returns {void} Nothing.
 * @throws Throws an error when the given value is an empty string.
 * @throws {TypeError} When the given value is not a string.
 */
function validateStringInput(value, propertyName) {
  validateType(value, isString);

  // Empty validation
  if (isEmptyString(value)) {
    throw new Error(Errors.EMPTY_PROPERTY.replace("PROPERTY", propertyName));
  }
}
