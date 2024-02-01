import React, { useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "./PopupModal";
import MessagePopup from "./MessageModal";
import Spinner from "../Common/LoadSpinner";
import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

type BirthDayFormValues = {
  day: string;
  month: string;
  year: string;
};

const range = (start: number, stop: number, step = -1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const BirthdayModal = ({ view, hide }: any) => {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const [msgPopup, setMsgpopup] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dobState, setDobState] = useState<BirthDayFormValues>({
    day: "",
    month: "",
    year: "",
  });

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      e.persist();

      if (e.target.name) {
        setDobState(prevState => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitFrom = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const dob = new Date(`${dobState.year}-${dobState.month}-${dobState.day}`);

      if (profile) {
        setIsSubmitting(true);
        const constantApi = new ConstantsAPI();
        constantApi.birthdayGlammPoints(dob.toISOString(), profile.id).then(res => {
          if (res.status === 200) {
            setMsgpopup(true);
            setIsSubmitting(false);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PopupModal show={view && !msgPopup} onRequestClose={hide} type="center-modal">
        <div className="bg-white rounded-lg relative">
          <div className="modal-content px-3 py-7">
            <div id="birthday-popup-modal">
              <div className="mx-10">
                <h2 className="text-center uppercase text-18">A special birthday gift could be yours if you</h2>
                <p className="text-center font-semibold text-2xl">tell us when your birthday is!</p>
              </div>
              <button type="button" onClick={hide} className="absolute top-2 right-4 outline-none text-4xl">
                ×
              </button>
              <div className="fullwidth pull-left">
                <form className="m-2.5" onSubmit={onSubmitFrom}>
                  <div className="for-m-mob-site">
                    <div className="form-row no-padder">
                      <label htmlFor="referralCode">Day</label>
                      <select
                        className="float-left w-full bg-white border rounded p-1.5 my-2 border-gray-300"
                        name="day"
                        value={dobState.day || ""}
                        onChange={onChangeSelect}
                        placeholder="Day"
                        required
                      >
                        <option aria-label="UnSelected" />
                        {[...Array(31).keys()]
                          .map(k => k + 1)
                          .map(day => (
                            <option value={day} key={day}>
                              {day}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-row no-padder">
                      <label htmlFor="referralCode">Month</label>
                      <select
                        className="select month float-left w-full bg-white border rounded p-1.5 my-2 border-gray-300"
                        name="month"
                        value={dobState.month || ""}
                        onChange={onChangeSelect}
                        placeholder="Month"
                        required
                      >
                        <option aria-label="UnSelected" />
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                    </div>

                    <div className="form-row no-padder">
                      <label htmlFor="referralCode">Year</label>
                      <select
                        className="select year float-left w-full bg-white border rounded p-1.5 my-2 border-gray-300"
                        name="year"
                        value={dobState.year || ""}
                        onChange={onChangeSelect}
                        placeholder="Year"
                        required
                      >
                        <option aria-label="UnSelected" />
                        {range(new Date().getFullYear(), 1970).map(year => (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="w-full mt-5 mb-7 bg-ctaImg text-white p-1.5 rounded">
                      {isSubmitting ? <Spinner className="relative w-6 mx-auto" /> : <span className="btn">SUBMIT</span>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </PopupModal>

      <MessagePopup
        view={msgPopup}
        hide={() => {
          hide();
          setMsgpopup(false);
        }}
      />
    </>
  );
};

export default BirthdayModal;
