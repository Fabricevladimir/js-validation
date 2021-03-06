import React, { useState } from "react";

import useForm from "../../hooks/useForm";
import { Schema } from "../../validation";
import "./DemoForm.css";

const defaultSchema = {
  password: new Schema()
    .min(5, "My custom min error message.")
    .max(7)
    .hasDigit("My custom digit error message.")
    .hasSymbol()
    .isRequired(),

  username: new Schema()
    .min(5)
    .hasSymbol()
    .hasPattern(/abc/)
    .hasLowercase()
    .hasUppercase("My custom uppercase error message."),

  confirmPassword: new Schema().matches("password", "MUST MATCH").isRequired(),
};

const DemoForm = () => {
  const {
    form,
    errors,
    submitError,
    handleReset,
    handleSubmit,
    handleInputChange,
  } = useForm(defaultSchema);

  const [submitErrorPresent, setSubmitError] = useState(false);

  function handleSubmitErrorToggled() {
    setSubmitError(!submitErrorPresent);
  }

  function doSubmit() {
    try {
      if (submitErrorPresent) throw new Error("Error while submitting form");
      alert(
        `Submitted form with username ${form.username} and password ${form.password}`
      );
    } catch (error) {
      // do your random stuff
      throw error;
    }
  }

  function onFormSubmit(event) {
    event.preventDefault();
    handleSubmit(doSubmit);
  }

  return (
    <form className="form" onReset={handleReset} onSubmit={onFormSubmit}>
      <label htmlFor="submitError">
        Error when submitting
        <input
          id="submitError"
          type="checkbox"
          onChange={handleSubmitErrorToggled}
        />
      </label>
      <div className="property">
        <input
          name="username"
          type="text"
          value={form.username}
          placeholder="Username (pattern is 'abc')"
          onChange={handleInputChange}
        />
        <span>{errors["username"]}</span>
      </div>
      <div className="property">
        <input
          type="text"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleInputChange}
        />
        <span>{errors["password"]}</span>
      </div>
      <div className="property">
        <input
          type="text"
          name="confirmPassword"
          value={form.confirmPassword}
          placeholder="Confirm Password"
          onChange={handleInputChange}
        />
        <span>{errors["confirmPassword"]}</span>
      </div>
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
        <span>{submitError}</span>
      </div>
    </form>
  );
};

export default DemoForm;
