"use client";

import { useState } from "react";
import Modal from "./components/modal";

export default function Home() {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <main className="h-screen flex justify-center items-center">
      <button
        type="button"
        className="w-full rounded-[20px] px-2.75 py-1.75 border bg-thang-e9 hover:bg-thang-4 hover:text-thang-e9"
        onClick={() => setOpenModal(true)}
      >
        모달 {openModal ? "Close" : "Open"}
      </button>
      <Modal open={openModal} setOpen={setOpenModal} />
    </main>
  );
}
