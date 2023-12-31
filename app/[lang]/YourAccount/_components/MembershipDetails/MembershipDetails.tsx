"use client";
import BaseInput from "@/app/_components/BaseInput/BaseInput";
import styles from "@/app/[lang]/YourAccount/page.module.scss";
import { ChangeEvent, useState } from "react";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  getAuth,
  updatePhoneNumber,
} from "firebase/auth";
import firebase_app from "@/app/_utils/firebase/firebase-client";
import InputModal from "../InputModal/InputModal";
import BaseModal from "@/app/_components/BaseModal/BaseModal";
import { User } from "@/types";

export default function Membership({ user }: { user: User }) {
  const auth = getAuth(firebase_app);

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recap", {
      size: "invisible", // this property is important otherwise the captcha will be displayed on the screen
    });

    window.recaptchaVerifier.verify();
  };

  const [number, setNumber] = useState<{
    newNumber: string;
    changeNumber: boolean;
  }>({ newNumber: "", changeNumber: false });
  const [error, setError] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isNumberModal, setIsNumberModal] = useState<boolean>(false);
  let applicationVerifier: RecaptchaVerifier;
  async function setPhoneNumber(verCode: string) {
    setIsNumberModal(false);
    setIsModal(false);
    try {
      //sets phone credentials
      const phoneCredential = await PhoneAuthProvider.credential(
        verificationId,
        verCode
      );
      // Updates phone number
      await updatePhoneNumber(auth.currentUser!, phoneCredential);
      setNumber({ ...number, changeNumber: true });
      setVerificationId("");
      //updates phone number before refresh
    } catch (err: any) {
      setNumber({ ...number, newNumber: "" });
      setIsModal(true);
      setError(err.message);
      return err;
    }
  }

  async function verifyNewNumber(newNum: string) {
    if (!newNum) {
      setIsNumberModal(false);
      return;
    }
    applicationVerifier = window.recaptchaVerifier;
    //hides modal
    setIsNumberModal(false);

    const num = newNum.replace(/\s+/g, "");
    //Provider of auth
    const provider = new PhoneAuthProvider(auth);

    //Button cancel animate
    try {
      //verifies new number
      const id = await provider.verifyPhoneNumber(num, applicationVerifier);
      setNumber({ ...number, newNumber: num });
      setVerificationId(id);
    } catch (err) {}
    //shows modal to enter verification code for new number
    setIsModal(true);
  }

  async function verifyCode(code: string) {
    setIsModal(false);
    if (code) {
      const setPhone = await setPhoneNumber(code);
    }
  }

  async function updatePhone(e: any) {
    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
    applicationVerifier = window.recaptchaVerifier;
    e.preventDefault();

    if (typeof e !== "string") {
      setIsNumberModal(true);
      return;
    }

    const num = number.newNumber.replace(/\s+/g, "");

    try {
      const provider = new PhoneAuthProvider(auth);

      const id = await provider.verifyPhoneNumber(num, applicationVerifier);
      setNumber({ ...number, newNumber: num });
      setVerificationId(id);

      setIsModal(true);
    } catch (e) {}
  }

  return (
    <>
      {isModal && (
        <BaseModal
          message={error}
          title={error ? "Error" : "Verification"}
          hideModal={(e: string) => verifyCode(e)}
        />
      )}
      {isNumberModal && (
        <InputModal hideModal={(e: any) => verifyNewNumber(e)} />
      )}
      <div id="recap"></div>
      <div className={styles["account"]}>
        <div className={styles["category"]}>
          <h3>MEMBSERSHIP AND BILLING</h3>
        </div>
        <div className={styles["details"]}>
          <div className={styles["detail-item"]}>
            <p>{user!.email}</p>
            <button className={styles["change-button"]}>
              Change your email address
            </button>
          </div>
          <div className={styles["detail-item"]}>
            <p>Password: ********</p>
            <button className={styles["change-button"]}>Change password</button>
          </div>

          <div
            className={`${styles["detail-item"]}`}
            // :className="!phone.number ? 'item-input' : ''"
          >
            {!user!.phoneNumber && (
              <form
                onSubmit={(e) => updatePhone(e)}
                //   @submit.prevent="updatePhone(phone.firstNumber)"
                className={styles["item-input"]}
                action=""
              >
                <BaseInput
                  value={number.newNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNumber({ ...number, newNumber: e.target.value })
                  }
                  fullWidth={false}
                  required
                  border={true}
                  isBackground={true}
                  name="Phone Number"
                  complete="tel"
                  type="tel"
                  pattern="^\+\d{1,4}(\s?\d){9,12}$"
                />

                <button
                  // :className="phone.buttonCaptcha ? 'button-spinner' : ''"
                  id="recaptcha-container"
                  className={styles["change-button"]}
                >
                  {!loading && <span>Change phone number</span>}
                  {loading && (
                    <div className={styles["loader"]}>
                      <span className={styles["loader-circle"]}></span>
                    </div>
                  )}
                </button>
              </form>
            )}

            <p>{number.changeNumber ? number.newNumber : user!.phoneNumber}</p>
            {user!.phoneNumber && (
              <div className={styles["btn"]}>
                <button
                  // :className="phone.buttonCaptcha ? 'button-spinner' : ''"
                  onClick={(e) => updatePhone(e)}
                  id="recaptcha-container"
                  className={styles["change-button"]}
                >
                  {!loading && <span>Change phone number</span>}
                  {loading && (
                    <div className={styles["loader"]}>
                      <span className={styles["loader-circle"]}></span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
