import { Accessibility, Car, GripHorizontal, GripVertical, Minus, Pencil, Plus, PlusCircle, Save, SmartphoneCharging, Square, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { addMultipleSpotsExact, updateMultipleSpots, deleteMultipleSpots } from "../assets/api/parks/park";
import { cn } from "../lib/utils";
import { Button, message, Popconfirm, Select } from "antd";
import { UpdateMultipleSpotModal } from "./admin/parks/updateModals";

export function EditableParkMap({ park, setParkSpots }) {
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
    if (spots.length == 0) {
      setSpots([{ x: 0, y: 0, name: "P 0", status: "available", park_id: park.id, type: "maintenance" }]);
    }
  }, [spots, park.spots]);

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
      console.log(rows)
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
    } else if (value === "select-filled") {
      const filledSpots = spots.map(spot => ({ x: spot.x, y: spot.y }));
      setSelected(filledSpots);
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


      if (addRes.success || updateRes.success || deleteRes.success ) {
        setParkSpots(park.id, spots)
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
    <div className="flex flex-col justify-center border w-full container mx-auto rounded border-gray-200">{contextHolder}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-10 m-2">
        <div className="flex justify-between sm:justify-center gap-2">
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
            <Select.Option value="select-filled">Select filled</Select.Option>
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
            className="btn btn-primary btn-sm sm:w-fit"
          >
            <Save /> Save
          </Button>
        </Popconfirm>
      </div>

      <div className="flex justify-between gap-1 m-2">
        <div className="flex flex-col gap-1">
          <div className="flex text-center gap-2">
            <Car className="w-1/6" />
            <span className="w-4/6">Standard</span>
            <span className="badge badge-sm badge-primary w-1/6">
              {spots.filter(spot => spot.type === "standard").length}
            </span>
          </div>
          <div className="flex text-center gap-2">
            <SmartphoneCharging className="w-1/6" />
            <span className="w-4/6">Electric</span>
            <span className="badge badge-sm badge-primary w-1/6">
              {spots.filter(spot => spot.type === "electric").length}
            </span>
          </div>
          <div className="flex text-center gap-2">
            <Accessibility className="w-1/6" />
            <span className="w-4/6">Accessible</span>
            <span className="badge badge-sm badge-primary w-1/6">
              {spots.filter(spot => spot.type === "accessible").length}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row-reverse text-center gap-2">
            <div className="w-1/6 flex justify-center items-center" ><span className="w-5 h-5 border rounded-sm" /></div>
            <span className="w-4/6">Available</span>
            <span className="badge badge-sm badge-neutral badge-outline w-1/6">
              {spots.filter(spot => spot.status === "available").length}
            </span>
          </div>
          <div className="flex flex-row-reverse text-center gap-2">
            <div className="w-1/6 flex justify-center items-center" ><span className="w-5 h-5 border rounded-sm bg-secondary/50" /></div>
            <span className="w-4/6">Reserved</span>
            <span className="badge badge-sm badge-secondary w-1/6">
              {spots.filter(spot => spot.status === "reserved").length}
            </span>
          </div>
          <div className="flex flex-row-reverse text-center gap-2">
            <div className="w-1/6 flex justify-center items-center" ><span className="w-5 h-5 border rounded-sm bg-warning/75" /></div>
            <span className="w-4/6">Maintenance</span>
            <span className="badge badge-sm badge-warning w-1/6">
              {spots.filter(spot => spot.status === "maintenance").length}
            </span>
          </div>
        </div>
      </div>

      <TransformWrapper
        initialScale={1}
        limitToBounds={false}
        minScale={0.2}
        maxScale={5}
        wheel={{ step: 0.15 }}
        doubleClick={{ disabled: true }}
        panning={{
          allowRightClickPan: false,
          allowMiddleClickPan: false,
          // activationKeys: ['Control', 'Space'],
          velocityDisabled: true,
          excluded: ['button'] 
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="z-10 flex bg-base-200 gap-2 p-2">
              <button 
                onClick={() => zoomIn()} 
                className="btn btn-secondary btn-sm btn-square"
              ><Plus strokeWidth={3} size={16} />
              </button>
              <button 
                onClick={() => zoomOut()} 
                className="btn btn-secondary btn-sm btn-square"
              ><Minus strokeWidth={3} size={16} />
              </button>
              <button 
                onClick={() => resetTransform()} 
                className="btn btn-secondary btn-sm text-base"
              >
                Reset
              </button>
            </div>
            <TransformComponent wrapperStyle={{width: "100%"}} wrapperClass="w-full h-full bg-base-200" contentClass="!w-fit !h-fit">
              {/* Full Grid */}
              <div className="p-12 inline-block relative min-h-96 overflow-hidden">
                {Array.from({ length: rows }, (_, y) => (
                  <div key={y} className="flex items-center w-fit relative">
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
                              (hoveredRow === y || hoveredColumn === x) && `${deleteSpot ? "bg-red-100 text-error border-error" : "bg-blue-100 text-primary border-primary"} opacity-100`,
                              spot?.status == 'reserved' && "bg-secondary/50",
                              spot?.status == 'maintenance' && "bg-warning/75",
                            )}
                              >
                            {spot ? (
                              <>
                                <div className="font-semibold">{spot.name}</div>
                                {spot?.type == 'accessible' ? <Accessibility size={22} />
                                 : spot?.type == 'electric' ? <SmartphoneCharging size={22} />
                                 : spot?.type == 'standard' && <Car size={22} />
                                }
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
              
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
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



export function ParkMap({ park, action = null }) {
  const spots = [...park.spots];

  const spotMap = new Map();
  spots.forEach(spot => {
    spotMap.set(`${spot.x},${spot.y}`, spot);
  });

  const columns = Math.max(...spots.map(s => s.x)) + 1;
  const rows = Math.max(...spots.map(s => s.y)) + 1;

  return (
    <div className="flex flex-col justify-center border w-full container mx-auto rounded border-gray-200">

      <div className="flex justify-between gap-1 m-2">
        <div className="flex flex-col gap-1">
          <div className="flex text-center gap-2">
            <Car className="w-1/6" />
            <span className="w-4/6">Standard</span>
            <span className="badge badge-sm badge-primary w-1/6">
              {spots.filter(spot => spot.type === "standard").length}
            </span>
          </div>
          <div className="flex text-center gap-2">
            <SmartphoneCharging className="w-1/6" />
            <span className="w-4/6">Electric</span>
            <span className="badge badge-sm badge-primary w-1/6">
              {spots.filter(spot => spot.type === "electric").length}
            </span>
          </div>
          <div className="flex text-center gap-2">
            <Accessibility className="w-1/6" />
            <span className="w-4/6">Accessible</span>
            <span className="badge badge-sm badge-primary w-1/6">
              {spots.filter(spot => spot.type === "accessible").length}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row-reverse text-center gap-2">
            <div className="w-1/6 flex justify-center items-center" ><span className="w-5 h-5 border rounded-sm" /></div>
            <span className="w-4/6">Available</span>
            <span className="badge badge-sm badge-neutral badge-outline w-1/6">
              {spots.filter(spot => spot.status === "available").length}
            </span>
          </div>
          <div className="flex flex-row-reverse text-center gap-2">
            <div className="w-1/6 flex justify-center items-center" ><span className="w-5 h-5 border rounded-sm bg-secondary/50" /></div>
            <span className="w-4/6">Reserved</span>
            <span className="badge badge-sm badge-secondary w-1/6">
              {spots.filter(spot => spot.status === "reserved").length}
            </span>
          </div>
          <div className="flex flex-row-reverse text-center gap-2">
            <div className="w-1/6 flex justify-center items-center" ><span className="w-5 h-5 border rounded-sm bg-warning/75" /></div>
            <span className="w-4/6">Maintenance</span>
            <span className="badge badge-sm badge-warning w-1/6">
              {spots.filter(spot => spot.status === "maintenance").length}
            </span>
          </div>
        </div>
      </div>

      <TransformWrapper
        initialScale={1}
        limitToBounds={false}
        minScale={0.2}
        maxScale={5}
        wheel={{ step: 0.15 }}
        doubleClick={{ disabled: true }}
        panning={{
          allowRightClickPan: false,
          allowMiddleClickPan: false,
          // activationKeys: ['Control', 'Space'],
          velocityDisabled: true,
          excluded: ['button'] 
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="z-10 flex bg-base-200 gap-2 p-2">
              <button 
                onClick={() => zoomIn()} 
                className="btn btn-secondary btn-sm btn-square"
              ><Plus strokeWidth={3} size={16} />
              </button>
              <button 
                onClick={() => zoomOut()} 
                className="btn btn-secondary btn-sm btn-square"
              ><Minus strokeWidth={3} size={16} />
              </button>
              <button 
                onClick={() => resetTransform()} 
                className="btn btn-secondary btn-sm text-base"
              >
                Reset
              </button>
            </div>
            <TransformComponent wrapperStyle={{width: "100%"}} wrapperClass="w-full h-full bg-base-200" contentClass="!w-fit !h-fit">
              {/* Full Grid */}
              <div className="p-16 inline-block relative min-h-96 overflow-hidden">
                {Array.from({ length: rows }, (_, y) => (
                  <div key={y} className="flex items-center">
                    {Array.from({ length: columns }, (_, x) => {
                      const spot = spotMap.get(`${x},${y}`);
                      return (
                        <div
                          key={`${x}-${y}`}
                          onClick={spot && action ? () => action(spot) : null}
                          className={cn(
                            "w-16 h-16 m-0.5 arrow select-none transition-[scale] hover:scale-105 rounded flex flex-col justify-center items-center text-xs",
                            spot && "border border-neutral bg-white hover:cursor-pointer",
                            spot?.status == 'reserved' && "bg-secondary/50",
                            spot?.status == 'maintenance' && "bg-warning/75",
                          )}
                            >
                          {spot ? (
                            <>
                              <div className="font-semibold">{spot.name}</div>
                              {spot?.type == 'accessible' ? <Accessibility size={22} />
                                : spot?.type == 'electric' ? <SmartphoneCharging size={22} />
                                : spot?.type == 'standard' && <Car size={22} />
                              }
                            </>
                          ) : (
                            <span className="flex justify-center items-center opacity-0">
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}