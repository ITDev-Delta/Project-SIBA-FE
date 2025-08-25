import { Modal } from "antd";
import ReactDOM from "react-dom/client";
import PrimaryButton from "../Button/PrimaryButton";

type ButtonConfig = {
  label: string;
  color?: string; // Optional color for the button text
  onClick: () => Promise<void> | void;
};

type ConfirmOptions = {
  title?: string;
  message?: string;
  buttons: ButtonConfig[];
};

export function ModalConfirm({
  title = "Konfirmasi",
  message = "Apakah ingin melanjutkan?",
  buttons,
}: ConfirmOptions) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  let loadingButtonIndex: number | null = null;

  const close = () => {
    root.unmount();
    div.remove();
  };

  const render = () => {
    root.render(
      // <ConfigProvider>
      <Modal
        open
        title={title}
        onCancel={() => close()}
        footer={null}
        closable
        maskClosable={true}
        centered
      >
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-6">
          {buttons.map((btn, index) => (
            <PrimaryButton
              key={index}
              isLoading={loadingButtonIndex === index}
              onClick={async () => {
                loadingButtonIndex = index;
                render();

                try {
                  await btn.onClick();
                  close();
                } catch (err) {
                  console.error("Action failed:", err);
                  loadingButtonIndex = null;
                  render();
                }
              }}
              color={btn.color}
            >
              {btn.label}
            </PrimaryButton>
          ))}
        </div>
      </Modal>
      // </ConfigProvider>
    );
  };

  render();
}
