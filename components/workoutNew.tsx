export function WorkoutForm() {
  return (
    <form className="border p-2 rounded-md">
      <div className="flex flex-col pb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
          Treenin nimi
        </label>
        <input
          className="p-1 bg-gray-50 w-full border border-gray-200 rounded-sm"
          type="text"
          placeholder="esim. Rinta"
        />
      </div>
      <div className="flex flex-col border bg-gray-50 border-gray-200 p-2 rounded-sm shadow-sm">
        <div className="flex justify-between p-2">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
              Liike #1
            </p>
          </div>
          <div>
            <select className="text-sm font-semibold bg-transparent text-gray-700 outline-none cursor-pointer hover:text-blue-600 transition-colors">
              <option>Vinopenkki - smith</option>
              <option>Vipunostot käsipainoilla</option>
              <option>Kyykky tangolla</option>
            </select>
          </div>
        </div>
        <div className="bg-white p-2 border border-gray-200 rounded-sm">
          sarja
        </div>
      </div>
    </form>
  );
}
