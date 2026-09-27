import { useState } from 'react';
import { Angle, CATEGORY_LABELS, CATEGORY_ORDER, AngleCategory } from '../../types';
import { getAnglesByCategory, DEFAULT_ANGLE_KEYS } from '../../data/angles';
import { Button, Modal, Checkbox, CategoryBadge } from '../ui';

interface AnglePickerProps {
  selectedAngles: string[];
  onChange: (angles: string[]) => void;
  disabled?: boolean;
}

export function AnglePicker({ selectedAngles, onChange, disabled }: AnglePickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const anglesByCategory = getAnglesByCategory();

  const selectedCount = selectedAngles.length;
  const baseCount = selectedAngles.filter(key =>
    DEFAULT_ANGLE_KEYS.includes(key)
  ).length;
  const extendedCount = selectedCount - baseCount;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Angles</h3>
          <p className="text-xs text-gray-500 mt-1">
            {selectedCount} selected ({baseCount} base, {extendedCount} extended)
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          disabled={disabled}
        >
          Choose Angles
        </Button>
      </div>

      {selectedCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedAngles.slice(0, 10).map(key => {
            const angle = Object.values(anglesByCategory)
              .flat()
              .find(a => a.key === key);
            return angle ? (
              <span
                key={key}
                className="inline-flex items-center text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
              >
                {angle.name}
              </span>
            ) : null;
          })}
          {selectedCount > 10 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{selectedCount - 10} more
            </span>
          )}
        </div>
      )}

      <AnglePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAngles={selectedAngles}
        onChange={onChange}
        anglesByCategory={anglesByCategory}
      />
    </div>
  );
}

interface AnglePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAngles: string[];
  onChange: (angles: string[]) => void;
  anglesByCategory: Record<AngleCategory, Angle[]>;
}

function AnglePickerModal({
  isOpen,
  onClose,
  selectedAngles,
  onChange,
  anglesByCategory,
}: AnglePickerModalProps) {
  const toggleAngle = (key: string) => {
    if (selectedAngles.includes(key)) {
      onChange(selectedAngles.filter(k => k !== key));
    } else {
      onChange([...selectedAngles, key]);
    }
  };

  const selectAll = () => {
    const allKeys = Object.values(anglesByCategory)
      .flat()
      .map(a => a.key);
    onChange(allKeys);
  };

  const selectBase = () => {
    onChange([...DEFAULT_ANGLE_KEYS]);
  };

  const clearAll = () => {
    onChange([]);
  };

  const toggleCategory = (category: AngleCategory) => {
    const categoryKeys = anglesByCategory[category].map(a => a.key);
    const allSelected = categoryKeys.every(k => selectedAngles.includes(k));

    if (allSelected) {
      onChange(selectedAngles.filter(k => !categoryKeys.includes(k)));
    } else {
      const newSelection = [...selectedAngles];
      categoryKeys.forEach(k => {
        if (!newSelection.includes(k)) {
          newSelection.push(k);
        }
      });
      onChange(newSelection);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Angles" size="lg">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={selectBase}>
          Base (7)
        </Button>
        <Button variant="secondary" size="sm" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-6">
        {CATEGORY_ORDER.map(category => {
          const angles = anglesByCategory[category];
          const categoryKeys = angles.map(a => a.key);
          const selectedInCategory = categoryKeys.filter(k =>
            selectedAngles.includes(k)
          ).length;

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={category} />
                  <span className="text-sm font-medium text-gray-700">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({selectedInCategory}/{angles.length})
                  </span>
                </div>
                <button
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                  onClick={() => toggleCategory(category)}
                >
                  {selectedInCategory === angles.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {angles.map(angle => (
                  <label
                    key={angle.key}
                    className={`
                      flex items-start p-2 rounded-md cursor-pointer border transition-colors
                      ${
                        selectedAngles.includes(angle.key)
                          ? 'bg-indigo-50 border-indigo-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={selectedAngles.includes(angle.key)}
                      onChange={() => toggleAngle(angle.key)}
                      className="mt-0.5"
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">{angle.name}</p>
                      <p className="text-xs text-gray-500">{angle.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Done ({selectedAngles.length} selected)
        </Button>
      </div>
    </Modal>
  );
}
