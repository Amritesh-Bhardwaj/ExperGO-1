import { useState } from "react";

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, string>[];
}

// Modal component to display data in a table
const DataTableModal = ({ isOpen, onClose, title, data }: DataTableModalProps) => {
    if (!isOpen) return null;
    console.log("Tat ",data);
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-5 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            className="text-2xl border-none bg-transparent cursor-pointer" 
            onClick={onClose}
            >
            ×
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((header) => (
                      <th
                      key={header}
                      className="border border-gray-300 p-2 bg-gray-100 text-left"
                      >
                      {header}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                  <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                  {Object.values(row).map((value, idx) => (
                      <td
                      key={idx}
                      className="border border-gray-300 p-2"
                      >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-3 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700"
            onClick={onClose}
            >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component with buttons to trigger the modals
const DataViewButtons = ({
  parsedTatData,
  parsedBookData,
}: {
  parsedTatData: Record<string, string>[];
  parsedBookData: Record<string, string>[];
}) => {
  const [showTatModal, setShowTatModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 bg-blue-100 text-blue-500 rounded cursor-pointer hover:bg-blue-200 transition-colors"
          onClick={() => setShowTatModal(true)}
        >
        TAT-Data
        </button>
        <button
          className="px-3 py-2 bg-blue-100 text-blue-500 rounded cursor-pointer hover:bg-blue-200 transition-colors"
          onClick={() => setShowBookModal(true)}
        >
        FTR-Data
        </button>
      </div>

      {/* TAT-FTR Data Modal */}
      <DataTableModal
        isOpen={showTatModal}
        onClose={() => setShowTatModal(false)}
        title="TAT-Data"
        data={parsedTatData}
      />

      {/* FTR Data Modal */}
      <DataTableModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        title="FTR-Data"
        data={parsedBookData}
      />
    </>
  );
};

export default DataViewButtons;
