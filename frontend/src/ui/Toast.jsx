import logo from "../assets/logo.png";

export default function ToastLayout({ message }) {
  return (
    <div
      id="toast-default"
      class="fixed bottom-8 right-8 flex items-center max-w-xs p-4 text-gray-600 backdrop-blur-md  rounded-lg shadow-md "
      role="alert"
    >
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8  bg-blue-100 rounded-lg">
        <img src={logo} alt="Logo" className="h-full aspect-square rounded" />
      </div>
      <div class="ms-3 text-sm font-normal">{message}</div>
    </div>
  );
}
