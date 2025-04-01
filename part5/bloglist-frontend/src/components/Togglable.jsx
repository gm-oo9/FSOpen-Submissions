import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      {!visible && <button onClick={toggleVisibility}>{props.buttonLabel}</button>}
      {visible && (
        <div>
          {props.children}
          <button onClick={toggleVisibility}>Cancel</button>
        </div>
      )}
    </div>
  );
});

export default Togglable;
