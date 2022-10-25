import React, { useState } from "react";
import { Button, Steps } from "antd";

const StepPanel = (props) => {
  const [activeStep, setActiveStep] = useState(0);

  function next() {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
  }

  function prev() {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
  }

  return (
    <>
      <Steps current={activeStep} style={{ width: 400 }}>
        {props.steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {props.steps.map((item) => (
        <div className={`steps-content ${item.step !== activeStep + 1 && "hidden"}`} style={{ marginTop: 30 }}>
          {item.content}
        </div>
      ))}
      <div className="steps-action">
        {activeStep < props.steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Tiếp
          </Button>
        )}
        {activeStep === props.steps.length - 1 && (
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        )}
        {activeStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            quay lại
          </Button>
        )}
      </div>
    </>
  );
};

export { StepPanel };
