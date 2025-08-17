import { createSignal } from 'solid-js';

const ToggleSwitch = () => {
  const [enabled, setEnabled] = createSignal(false);

  return (
    <div
      class={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        enabled() ? 'bg-orange-400' : 'bg-gray-300'
      }`}
      onClick={() => setEnabled(!enabled())}
    >
      <div
        class={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          enabled() ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
