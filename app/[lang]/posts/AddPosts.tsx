"use client"
import { FormEvent, FormEventHandler, TextareaHTMLAttributes, useRef, useState } from "react";
import { createUser } from "@/app/_firebase/getFirebase";
import { useRouter } from "next/navigation"; 
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";



export default function AddPosts({ styles }: any) {
  const [post, setPost] = useState("");
  const [active, setActive] = useState(false);
const textarea = useRef<HTMLTextAreaElement | null>(null)

function autoResize(event:any) {
  textarea.current!.style.height = "auto";
  textarea.current!.style.height = textarea.current!.scrollHeight + "px";
  setPost(event.target.value)

}

async function addData(e:any,bruh: string) {
e.preventDefault();
  const firestore = getFirestore();
  const timestamp = serverTimestamp();
  const newData = {
    post: bruh,
    user: "dupa",
    createdAt: timestamp,
  };
  addDoc(collection(firestore, "avatar"), newData);
  setPost("")
  textarea.current!.style.height = "auto";
}
  return (
   <>
   {post}
    <div className={styles["container"]}>
    <div className={styles["new-post-textarea"]}>
      <textarea
      className={styles["textarea"]}
        id="post-area"
         ref={textarea}
         onInput={autoResize}
         value={post}
        // @focusout="focusOut"
        // @change="post === '' ? (isActive = false) : (isActive = true)"
        // @focusin="focusIn"
        // @input="autoResize"
      />
      <label
        // :className="isActive ? 'label-active' : 'label'"
        // for="post-area"
        className={styles["label"]}
        >Add a new post
        </label>
    </div>
    <button
     onClick={(e)=>addData(e,post)}
    className={styles["button"]}
    >Add a new post</button>
  </div>
   </>
  );
}
