// src/components/Header.jsx
import BalanceDisplay from "./BalanceDisplay";

export default function Header() {

  return (
    <>
      <header className="hidden lg:block sticky top-0 border-b border-neutral-200 shadow-md px-6 py-4 bg-white">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-6">
            <BalanceDisplay/>
          </div>
        </div>
      </header>
    </>
  );
}