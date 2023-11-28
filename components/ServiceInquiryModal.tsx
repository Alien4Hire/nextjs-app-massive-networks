// @ts-nocheck
import React, { useState, useEffect } from "react";
import RecaptchaComponent from "./Recaptcha";

interface ServiceInquiryModalProps {
  isVisible: boolean;
  details: {
    address: string;
    recordID: string;
    center: string;
    carriers: string;

  };
  onClose: () => void;
}

const ServiceInquiryModal: React.FC<ServiceInquiryModalProps> = ({
  isVisible,
  details,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceSpeed, setServiceSpeed] = useState("");
  const [serviceDesired, setServiceDesired] = useState({
    internet: false,
    cloud: false,
    officeToOffice: false,
  });
  const [captchaValue, setCaptchaValue] = useState("");

  useEffect(() => {
    const checkboxComponent = document.querySelector("mass-checkbox-group");
    if (checkboxComponent) {
      checkboxComponent.checked = [
        serviceDesired.internet,
        serviceDesired.cloud,
        serviceDesired.officeToOffice,
      ];
      checkboxComponent.text = ["Internet", "Cloud", "Office to Office"];
    }
  }, [serviceDesired]);

  const handleSubmit = async () => {
    try {
      const data = {
        name: name,
        company: company,
        tel: phone,
        email: email,
        service: [],
        speed: [serviceSpeed], 
        message: "Sample message",
        recordID: details.recordID,
        center: details.center,
        address: details.address,
        carriers: details.carrier,
        ['g-recaptcha-response']: captchaValue,
      };
      if (serviceDesired.cloud) data.service.push("Cloud");
      if (serviceDesired.officeToOffice) data.service.push("Office to Office");
      if (serviceDesired.internet) data.service.push("Internet");

      const res = await fetch(
        "/api/quote-submit",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const body = await res.json();
      console.log(body);
      onClose();
    } catch (error) {
      console.error("Error in submitting form data", error);
    }
  };

  const handleCaptchaChange = (value) => {
   setCaptchaValue(value);
  };

  if (!isVisible) return null;

  return (
    <div className="z-[100] fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="modal bg-white p-4 rounded-lg shadow-md w-[50%]">
        <section className="body">
          <div className="w-full">
            <mass-text-field
              label-position="top"
              label-text="Your Name"
              input-placeholder-text="Placeholder"
              input-type="text"
              max-length={50}
              value={name}
              ref={(el) => {
                if (el) {
                  el.addEventListener("valueChange", (event) => {
                    setName(event.detail);
                  });
                }
              }}
            />
            <div className="mt-3">
              {" "}
              <mass-text-field
                label-position="top"
                label-text="Your Company Name"
                input-placeholder-text="Placeholder"
                input-type="text"
                max-length={50}
                value={company}
                ref={(el) => {
                  if (el) {
                    el.addEventListener("valueChange", (event) => {
                      setCompany(event.detail);
                    });
                  }
                }}
              />
            </div>

            <div className="mt-3">
              {" "}
              <mass-text-field
                label-position="top"
                label-text="Your Phone Number"
                input-placeholder-text="Placeholder"
                input-type="text"
                max-length={50}
                value={phone}
                ref={(el) => {
                  if (el) {
                    el.addEventListener("valueChange", (event) => {
                      setPhone(event.detail);
                    });
                  }
                }}
              />
            </div>

            <div className="mt-3">
              {" "}
              <mass-text-field
                label-position="top"
                label-text="Your Email"
                input-placeholder-text="Placeholder"
                input-type="text"
                max-length={50}
                value={email}
                ref={(el) => {
                  if (el) {
                    el.addEventListener("valueChange", (event) => {
                      setEmail(event.detail);
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-5">
            <mass-checkbox-group
              label="Services Desired"
              ref={(el) => {
                if (el) {
                  el.addEventListener("massChange", (event) => {
                    let values = { ...serviceDesired };
                    event.detail.forEach((value, index) => {
                      if (index === 0) {
                        values.internet = value;
                      } else if (index === 1) {
                        values.cloud = value;
                      } else if (index === 2) {
                        values.officeToOffice = value;
                      }
                      setServiceDesired(values);
                    });
                  });
                }
              }}
            />
          </div>
          <div className="mt-3">
            <mass-select-field
              input-id="input00"
              label="Service Speed(s) MB"
              type="light"
              label-position="top"
              is-disabled={false}
              has-error={false}
              ref
              error-message="No this is wrong"
              options={JSON.stringify([
                { name: "-", value: "-" },
                { name: "10 MB", value: "10" },
                { name: "20 MB", value: "20" },
                { name: "30 MB", value: "30" },
                { name: "40 MB", value: "40" },
                { name: "50 MB", value: "50" },
                { name: "60 MB", value: "60" },
                { name: "70 MB", value: "70" },
                { name: "80 MB", value: "80" },
                { name: "90 MB", value: "90" },
                { name: "100 MB", value: "100" },
                { name: "200 MB", value: "200" },
                { name: "300 MB", value: "300" },
                { name: "400 MB", value: "400" },
                { name: "500 MB", value: "500" },
                { name: "600 MB", value: "600" },
                { name: "700 MB", value: "700" },
                { name: "800 MB", value: "800" },
                { name: "900 MB", value: "900" },
                { name: "1000 MB", value: "1000" },
                { name: "2000 MB", value: "2000" },
                { name: "3000 MB", value: "3000" },
                { name: "4000 MB", value: "4000" },
                { name: "5000 MB", value: "5000" },
                { name: "6000 MB", value: "6000" },
                { name: "7000 MB", value: "7000" },
                { name: "8000 MB", value: "8000" },
                { name: "9000 MB", value: "9000" },
                { name: "10000 MB", value: "10000" },
              ])}
              ref={(el) => {
                if (el) {
                  el.addEventListener("valueChange", (event) => {
                    setServiceSpeed(event.detail);
                  });
                }
              }}
              value={serviceDesired}
              value="200 kms"
            />
          </div>
          <div className="mt-5">
            <mass-textarea
              value=""
              label="Additional Comments"
              placeholder="Have additional notes - more addresses? Paste them here:"
            />
          </div>
          <RecaptchaComponent onChange={handleCaptchaChange} />

          <button
            className={`${!name || !company || !email || !phone || !serviceSpeed || !captchaValue ? 'bg-gray-500': 'bg-blue-500'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2`}
            onClick={handleSubmit}
            disabled={!name || !company || !email || !phone || !serviceSpeed || !captchaValue}
          >
            Submit
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
            onClick={onClose}
            
          >
            Close
          </button>
        </section>
      </div>
    </div>
  );
};

export default ServiceInquiryModal;
