const { Input } = require("reactstrap");

const FormInput = ({ register, name, errors, ...rest }) => {
  const { ref, ...registerField } = register(name);
  return <Input innerRef={ref} {...registerField} {...rest} invalid={!!errors[name]} />;
};

export default FormInput;