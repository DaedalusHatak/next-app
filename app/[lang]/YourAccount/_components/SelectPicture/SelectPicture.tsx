"use client";
import Image from "next/image";
import styles from "./SelectPicture.module.scss";
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import firebase_app from "@/app/_utils/firebase/firebase-client";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "@/app/_store/avatar";
export default function SelectPicture({
  avatars,
  profile,
}: {
  avatars: string[];
  profile: string;
}) {
  const [selectedImage, setSelectedImage] = useState(profile);
  const dispatch = useDispatch();
  const avatar = useSelector(
    (state: { avatar: { value: { photoURL: string } } }) =>
      state.avatar.value.photoURL
  );
  function selectWithSpace(e: React.KeyboardEvent, selectedPicture: string) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setSelectedImage(selectedPicture);
    }
  }
  async function changeProfilePicture() {
    const auth = await getAuth(firebase_app);
    profile = selectedImage;
    updateProfile(auth.currentUser!, { photoURL: selectedImage });
    dispatch(setAvatar(selectedImage));
  }
  return (
    <>
      <div className={styles["change-pictures"]}>
        {avatars.map((picture: string, index: number) => (
          <Image
            key={index}
            //   :className="firestoreClient.avatar === picture ? 'selected' : ''"
            src={`/assets/profile/${picture}`}
            onClick={() => setSelectedImage(picture)}
            onKeyDown={(e: any) => selectWithSpace(e, picture)}
            //   @click="firestoreClient.avatar = picture"
            //   @keydown.space.exact.prevent="firestoreClient.avatar = picture"
            //   @keydown.enter.exact.prevent="firestoreClient.avatar = picture"
            className={`${styles["profile-pictures"]} ${
              selectedImage === picture ? styles["selected"] : ""
            }`}
            width={100}
            height={100}
            alt=""
            tabIndex={0}
          />
        ))}
      </div>
      <div className={`${styles["change-pictures"]} ${styles["single-grid"]}`}>
        <button
          //   @click="updatePhoto(firestoreClient.avatar)"
          onClick={() => changeProfilePicture()}
          className={styles["profile-button"]}
        >
          Save changes
        </button>
      </div>
    </>
  );
}
