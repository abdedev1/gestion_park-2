import { Accessibility, Car, GripHorizontal, GripVertical, Pencil, Plus, PlusCircle, Save, SmartphoneCharging, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { addMultipleSpotsExact, updateMultipleSpots, deleteMultipleSpots } from "../assets/api/parks/park";
import { cn } from "../lib/utils";
import { Button, message, Popconfirm, Select } from "antd";
import { UpdateMultipleSpotModal } from "./admin/parks/updateModals";

export function EditableParkMap({ park }) {
  const [spots, setSpots] = useState([...park.spots]);
  const [selected, setSelected] = useState([]);
  const [extraRows, setExtraRows] = useState(1);
  const [extraColumns, setExtraColumns] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [selectValue, setSelectValue] = useState(null);
  const [deleteSpot, setDeleteSpot] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const rows = Math.max(...spots.map(s => s.y)) + extraRows;
  const columns = Math.max(...spots.map(s => s.x)) + extraColumns;

  useEffect(() => {
    setHasChanges(JSON.stringify(spots) === JSON.stringify(park.spots));
  }, [spots]);

  const spotMap = new Map();
  spots.forEach(spot => {
    spotMap.set(`${spot.x},${spot.y}`, spot);
  });
  

  const addRow = (row) => {
    let found = false;
    const newSpots = spots.map(spot => {
      if (spot.y >= row) {
        found = true;
        return { ...spot, y: spot.y + 1 };
      }
      return spot;
    });
  
    const newSelected = selected.map(sel => {
      if (sel.y >= row) {
        return { ...sel, y: sel.y + 1 };
      }
      return sel;
    });
  
    if (found) {
      setSpots(newSpots);
      setSelected(newSelected);
    } else {
      setExtraRows(extraRows + 1);
    }
  };

  const addColumn = (column) => {
    let found = false;
    const newSpots = spots.map(spot => {
      if (spot.x >= column) {
        found = true;
        return { ...spot, x: spot.x + 1 };
      }
      return spot;
    });

    const newSelected = selected.map(sel => {
      if (sel.x >= column) {
        return { ...sel, x: sel.x + 1 };
      }
      return sel;
    });

    if (found) {
      setSpots(newSpots);
      setSelected(newSelected);
    } else {
      setExtraColumns(extraColumns + 1);
    }
  };

  const handelSelect = (value) => {
    if (value === "select-all") {
      const allSpots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          allSpots.push({ x, y });
        }
      }
      setSelected(allSpots);
    } else if (value === "deselect-all") {
      setSelected([]);
    } else if (value === "inverse") {
      const allSpots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          allSpots.push({ x, y });
        }
      }
      const inverted = allSpots.filter(spot =>
        !selected.some(sel => sel.x === spot.x && sel.y === spot.y)
      );
      setSelected(inverted);
    }
    setSelectValue(null);
  }

  const toggleSelect = (spot, { x, y }) => {
    const key = `${x},${y}`;
    const isSelected = selected.some(sel => sel.x === x && sel.y === y);
  
    if (isSelected) {
      // Deselect
      setSelected(selected.filter(sel => sel.x !== x || sel.y !== y));
    } else {
      // Select
      const entry = spot ? spot : { x, y, name: "" };
      setSelected([...selected, entry]);
    }
  };
  
  const toggleRowSelect = (row) => {
    const newSelected = [...selected];
    const rowSpots = [];
  
    for (let x = 0; x < columns; x++) {
      rowSpots.push({ x, y: row });
    }
  
    const allSelected = rowSpots.every(spot =>
      selected.some(s => s.x === spot.x && s.y === spot.y)
    );
  
    if (allSelected) {
      // Deselect all
      setSelected(newSelected.filter(s => s.y !== row));
    } else {
      // Add missing
      rowSpots.forEach(spot => {
        if (!newSelected.some(s => s.x === spot.x && s.y === spot.y)) {
          newSelected.push(spot);
        }
      });
      setSelected(newSelected);
    }
  };
  
  const toggleColumnSelect = (col) => {
    const newSelected = [...selected];
    const colSpots = [];
  
    for (let y = 0; y < rows; y++) {
      colSpots.push({ x: col, y });
    }
  
    const allSelected = colSpots.every(spot =>
      selected.some(s => s.x === spot.x && s.y === spot.y)
    );
  
    if (allSelected) {
      // Deselect all
      setSelected(newSelected.filter(s => s.x !== col));
    } else {
      // Add missing
      colSpots.forEach(spot => {
        if (!newSelected.some(s => s.x === spot.x && s.y === spot.y)) {
          newSelected.push(spot);
        }
      });
      setSelected(newSelected);
    }
  };

  const hasFullRowOrColumnSelected = () => {
    if (selected.length === 0) return false;
  
    // Check for full row
    for (let y = 0; y < rows; y++) {
      let fullRow = true;
      for (let x = 0; x < columns; x++) {
        if (!selected.some(s => s.x === x && s.y === y)) {
          fullRow = false;
          break;
        }
      }
      if (fullRow) return true;
    }
  
    // Check for full column
    for (let x = 0; x < columns; x++) {
      let fullColumn = true;
      for (let y = 0; y < rows; y++) {
        if (!selected.some(s => s.x === x && s.y === y)) {
          fullColumn = false;
          break;
        }
      }
      if (fullColumn) return true;
    }
  
    return false;
  };

  const deleteRow = (row) => {
    const newSpots = spots.filter(spot => spot.y !== row).map(spot => ({
      ...spot,
      y: spot.y > row ? spot.y - 1 : spot.y
    }));
  
    const newSelected = selected.filter(sel => sel.y !== row).map(sel => ({
      ...sel,
      y: sel.y > row ? sel.y - 1 : sel.y
    }));
  
    setSpots(newSpots);
    setSelected(newSelected);
    if (row >= rows-extraRows+1) setExtraRows(extraRows-1)
  };

  const deleteColumn = (col) => {
    const newSpots = spots.filter(spot => spot.x !== col).map(spot => ({
      ...spot,
      x: spot.x > col ? spot.x - 1 : spot.x
    }));
  
    const newSelected = selected.filter(sel => sel.x !== col).map(sel => ({
      ...sel,
      x: sel.x > col ? sel.x - 1 : sel.x
    }));
  
    setSpots(newSpots);
    setSelected(newSelected);
    if (col >= columns-extraColumns+1) setExtraColumns(extraColumns-1)
  };

  const saveChanges = async () => {
    const originalSpots = [...park.spots];

    const spotsToAdd = spots.filter(s => !s.id);
    const spotsToUpdate = spots.filter(s => s.id);
    const currentIds = new Set(spotsToUpdate.map(s => s.id));
    const spotsToDelete = originalSpots.filter(s => !currentIds.has(s.id)).map(s => s.id);

    try {
  
      let addRes = spotsToAdd.length ? await addMultipleSpotsExact(spotsToAdd) : { success: false };
      let updateRes = spotsToUpdate.length ? await updateMultipleSpots(spotsToUpdate) : { success: false };
      let deleteRes = spotsToDelete.length ? await deleteMultipleSpots(spotsToDelete) : { success: false };

      if (addRes.success && updateRes.success && deleteRes.success ) {
          messageApi.success("All changes are saved successfully");
        }
  
    } catch (error) {
      console.error("Error saving changes:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to save changes. Please try again."
      );
    }
  }; 
  

  return (
    <div className="flex flex-col justify-center gap-4 border w-fit">{contextHolder}
      <div className="flex items-center justify-between gap-2 mx-4">
        <div className="flex items-center justify-center gap-2">
          <Select
            value={selectValue}
            placeholder={<span className="text-neutral">{selected.length} Selected</span>}
            className="rounded w-40"
            onChange={(value) => {
              setSelectValue(value);
              handelSelect(value);
            }}
          >
            <Select.Option value="select-all">Select all</Select.Option>
            <Select.Option value="deselect-all">Deselect all</Select.Option>
            <Select.Option value="inverse">Inverse</Select.Option>
          </Select>

          <Button
            className="btn btn-primary btn-sm"
            disabled={!selected.length}
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil size={16} /> Edit Spots
          </Button>
        </div>

        <Popconfirm
          title="Are you sure you want to save these changes?"
          onConfirm={saveChanges}
          okText="Yes"
          cancelText="No"
          disabled={hasChanges}
        >
          <Button
            disabled={hasChanges}
            className="btn btn-primary btn-sm"
          >
            <Save /> Save
          </Button>
        </Popconfirm>
      </div>
      <div className="flex flex-col p-20 bg-base-200">
        {Array.from({ length: rows }, (_, y) => (
          <div key={y} className="flex items-center relative">
            <div className="absolute z-20 -left-8 -top-[11px] flex items-center arrow">
              <div className="bg-white p-0.5 rounded border cursor-pointer transition hover:scale-110 hover:bg-green-100 hover:border-green-500 hover:text-green-500" onClick={() => addRow(y)}>
                <Plus strokeWidth={3} size={16} />
              </div>
                <span className="h-[2px] rounded-3xl bg-green-500 blur-[2px] opacity-0 transition duration-300" style={{width: `${columns*70}px`}}>
                </span>
            </div>
            <div
              className="absolute z-20 -left-7.5 top-6 py-0.5 rounded border cursor-pointer transition hover:scale-110 bg-blue-100 hover:border-primary hover:text-primary"
              onClick={() => toggleRowSelect(y)}
              onMouseEnter={() => setHoveredRow(y)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <GripVertical size={16} />
            </div>
            <div
              className="absolute z-20 -right-7.5 top-6 p-0.5 rounded border cursor-pointer transition hover:scale-110 bg-red-100 hover:border-red-500 hover:text-red-500"
              onClick={() => deleteRow(y)}
              onMouseEnter={() => {
                setDeleteSpot(true)
                setHoveredRow(y)}}
              onMouseLeave={() => {
                setDeleteSpot(false)
                setHoveredRow(null)}}
            >
              <Trash size={16} />
            </div>
            { y == rows-1 &&
              <div className="absolute z-20 -left-8 -bottom-[11px] flex items-center arrow">
                <div className="bg-white p-0.5 rounded border cursor-pointer transition hover:scale-110 hover:bg-green-100 hover:border-green-500 hover:text-green-500" onClick={() => addRow(y+1)}>
                  <Plus strokeWidth={3} size={16} />
                </div>
                  <span className="h-[2px] rounded-3xl bg-green-500 blur-[2px] opacity-0 transition duration-300" style={{width: `${columns*70}px`}}>
                  </span>
              </div>
            }
            
            {Array.from({ length: columns }, (_, x) => {
              const spot = spotMap.get(`${x},${y}`);
              const isSelected = selected.some(sel => sel.x === x && sel.y === y);
              return (
                <div key={x} className="relative">
                  { y == 0 &&
                    <>
                      <div className="absolute z-20 -left-[11px] -top-8 flex flex-col items-center arrow">
                        <div className="bg-white p-0.5 rounded border cursor-pointer transition hover:scale-110 hover:bg-green-100 hover:border-green-500 hover:text-green-500" onClick={() => addColumn(x)}>
                          <Plus strokeWidth={3} size={16} />
                        </div>
                          <span className="w-[2px] rounded-3xl bg-green-500 blur-[2px] opacity-0 transition duration-300" style={{height: `${rows*70}px`}}>
                          </span>
                      </div>
                      <div
                        className="absolute z-20 -top-7.5 left-6 px-0.5 rounded border cursor-pointer transition hover:scale-110 bg-blue-100 hover:border-primary hover:text-primary"
                        onClick={() => toggleColumnSelect(x)}
                        onMouseEnter={() => setHoveredColumn(x)}
                        onMouseLeave={() => setHoveredColumn(null)}
                      >
                        <GripHorizontal size={16} />
                      </div>
                    </>
                  }
                  { y == 0 && x == columns-1 &&
                    <div className="absolute z-20 -right-[11px] -top-8 flex flex-col items-center arrow">
                    <div className="bg-white p-0.5 rounded border cursor-pointer transition hover:scale-110 hover:bg-green-100 hover:border-green-500 hover:text-green-500" onClick={() => addColumn(x+1)}>
                      <Plus strokeWidth={3} size={16} />
                    </div>
                      <span className="w-[2px] rounded-3xl bg-green-500 blur-[2px] opacity-0 transition duration-300" style={{height: `${rows*70}px`}}>
                      </span>
                  </div>
                  }
                  {y === rows - 1 && (
                    <div
                      className="absolute z-20 left-6 -bottom-7.5 p-0.5 rounded border cursor-pointer transition hover:scale-110 bg-red-100 hover:border-red-500 hover:text-red-500"
                      onClick={() => deleteColumn(x)}
                      onMouseEnter={() => {
                        setDeleteSpot(true)
                        setHoveredColumn(x)}}
                      onMouseLeave={() => {
                        setDeleteSpot(false)
                        setHoveredColumn(null)}}
                    >
                      <Trash size={16} />
                    </div>
                  )}
                  <div
                    key={`${x}-${y}`}
                    onClick={() => toggleSelect(spot, {x, y})}
                    className={cn(
                      "w-16 h-16 m-0.5 arrow select-none transition-[scale] hover:scale-105 hover:cursor-pointer rounded flex flex-col justify-center items-center text-xs",
                      spot ? "border border-neutral bg-white" : "border border-primary bg-white/50 opacity-0 hover:opacity-100",
                      isSelected && "ring-4 ring-primary border-0 ring-offset-0 bg-blue-200 opacity-100",
                      (hoveredRow === y || hoveredColumn === x) && `${deleteSpot ? "bg-red-100 border-error" : "bg-blue-100 border-primary"} opacity-100`,
                      spot?.status == 'maintenance' && "bg-yellow-400",
                    )}
                      >
                    {spot ? (
                      <>
                        <div className="font-semibold">{spot.name}</div>
                        <div className="text-[10px] text-gray-600">
                          x:{x}, y:{y}
                        </div>
                      </>
                    ) : (
                      <span className="flex justify-center items-center opacity-0">
                        <PlusCircle className="text-primary" size={20} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {Boolean(selected.length) && (
        <UpdateMultipleSpotModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false)}}
          park_id={park.id}
          selected={selected}
          setSelected={setSelected}
          spots={spots}
          setSpots={setSpots}
          setRows={setExtraRows}
          setColumns={setExtraColumns}
        />
      )}
    </div>
  );
}


export function ParkMap({park}) {
  const [spots, setSpots] = useState([...park.spots]);

  const spotMap = new Map();
  spots.forEach(spot => {
    spotMap.set(`${spot.x},${spot.y}`, spot);
  });

  const columns = Math.max(...spots.map(s => s.x)) + 1;
  const rows = Math.max(...spots.map(s => s.y)) + 1;
  

  return (
    <div className="inline-block border p-2 bg-gray-100">
      {/* Full Grid */}
      <div className="flex flex-col">
        {Array.from({ length: rows + 1 }, (_, y) => (
          <div key={y} className="flex items-center">
            {Array.from({ length: columns }, (_, x) => {
              const spot = spotMap.get(`${x},${y}`);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-16 h-16 border m-0.5 rounded flex flex-col justify-center items-center text-xs ${
                    spot
                      ? spot.status === 'available'
                        ? 'bg-green-400'
                        : spot.status === 'reserved'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                      : 'bg-white'
                  }`}
                >
                  {spot ? (
                    <>
                      <div className="font-semibold">{spot.name}</div>
                      <div className="text-[10px] text-gray-600">
                        x:{x}, y:{y}
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] text-gray-600">Empty</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}