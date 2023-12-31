import { ChangeEvent, FormEvent, useState } from "react";
import BaseInput from "../../../../_components/BaseInput/BaseInput";
import { createUser } from "@/app/_utils/firebase/getFirebase";
import { useRouter } from "next/navigation";

export default function SecondStep({
  data,
  styles,
  showModal,
}: {
  data: string | boolean;
  styles: any;
  showModal: any;
}) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(typeof data === "string" ? data : "");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  async function createUserForm(e: FormEvent) {
    e.preventDefault();
    const status = await createUser(email, password);

    if (status === true) {
      showModal(status);
    } else {
      console.log(status);
      showModal(status);
    }
  }

  return (
    <form
      onSubmit={(e: FormEvent) => createUserForm(e)}
      className={styles["form"]}
    >
      <div className={styles["title"]}>
        <h2 className={styles["h2"]}>
          Create a password to start your membership
        </h2>
        <p className={styles["p"]}>Just a few more steps and you are done!</p>
        <p className={styles["p"]}>We hate paperwork, too.</p>
      </div>
      <p></p>
      <BaseInput
        name="Email Address"
        isBackground={true}
        type="email"
        fullWidth={true}
        value={email}
        error={error}
        complete={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        required
      />

      <BaseInput
        name="Password"
        isBackground={true}
        type="password"
        fullWidth={true}
        complete="new-password"
        value={password}
        error={error}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        required
      />
      <button className={styles["button"]}>
        <span>Create</span>
      </button>
    </form>
  );
}
