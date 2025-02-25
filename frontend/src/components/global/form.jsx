import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const typeTextField = (<TextField/>).type;
const typeCheckbox = (<Checkbox/>).type;

let onSubmit = () => { };

const Form = ({ children }) => {

  const [count, setCount] = useState(0);

  function validate(c) {
    for (let rule of c.props.rules) {
      let r = rule(c.props.getter);
      if (r !== true) {
        // If is okay
        return r;
      }
    }
    // If is string
    return false;
  }

  const errList = [];

  useEffect(() => {
    if (count != 0) {
      if (errList.length == 0) {
        onSubmit();
      }
    }
  }, [count]);

  function errorWraper(componentArr, renderErr) {
    if (!Array.isArray(componentArr)) {
      componentArr = [componentArr];
    }

    componentArr = componentArr.map((c, v) => {
      if (c?.props) {
        if (c.props.onSubmit) {
          return <c.type {...c.props} key={v} onClick={() => {
            setCount(count + 1);
            onSubmit = c.props.onSubmit;
          }}>{c.props.children}</c.type>
        }

        if (c.type === typeTextField) {
          const err = renderErr ? validate(c) : false;
          if (err) errList.push(err);
          return <c.type
            {...({
              error: !!err,
              helperText: err,
              value: c.props.getter,
              key: v,
              onChange: (event) => c.props.setter(event.target.value),
              ...c.props,
              setter: undefined
            })} >
            {c.props.children && errorWraper(c.props.children, renderErr)}
          </c.type>
        } else if (c.type === typeCheckbox) {
          const err = renderErr ? (c.props.required && !c.props.getter) : undefined;
          if (err) errList.push('Required checkbox');
          return <FormControlLabel sx={err && {color: 'red'}} label={c.props.label} control={
            <c.type
              {...{
                ...c.props,
                onChange: (event) => c.props.setter(event.target.checked),
                setter: undefined,
                sx: err && {color: 'red'}
              }}></c.type>
          }></FormControlLabel>
        } else if (c.props.children) {
          return <c.type {...c.props} key={v}>{errorWraper(c.props.children, renderErr)}</c.type>
        }
      }
      return c;
    })
    return componentArr
  }

  return (
    <div>
      {errorWraper(children, count != 0)}
    </div>

  );
};


export default Form;
