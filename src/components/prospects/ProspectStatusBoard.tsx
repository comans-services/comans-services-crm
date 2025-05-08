
import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import StatusColumn from './StatusColumn';
import { DealStage, updateProspectDealStage } from '@/services/supabaseService';

interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  deal_stage_id: string | null;
  daysSinceLastContact?: number | null;
}

interface ProspectStatusBoardProps {
  prospects: Prospect[];
  dealStages: DealStage[];
  isLoading: boolean;
}

type StatusColumnType = {
  id: string;
  title: string;
  prospects: Prospect[];
};

const ProspectStatusBoard: React.FC<ProspectStatusBoardProps> = ({
  prospects,
  dealStages,
  isLoading,
}) => {
  const [columns, setColumns] = useState<StatusColumnType[]>([]);

  /**
   * Build / rebuild the board whenever prospects or stages change.
   * NOTE: `columns` is NOT in the dependency list – this prevents an infinite loop.
   */
  useEffect(() => {
    if (!dealStages.length) return;

    const stageMap: Record<string, StatusColumnType> = {};

    // Create a column object for every stage
    dealStages.forEach((stage) => {
      stageMap[stage.id] = { id: stage.id, title: stage.name, prospects: [] };
    });

    // Default column fallback (first stage)
    const defaultStageId = dealStages[0]?.id;

    // Slot each prospect into its stage column
    prospects.forEach((prospect) => {
      const targetId = prospect.deal_stage_id ?? defaultStageId;
      const targetStage = stageMap[targetId];
      
      // Only add to a valid stage
      if (targetStage) {
        targetStage.prospects.push(prospect);
      } else if (defaultStageId && stageMap[defaultStageId]) {
        // Fallback to default stage if target stage doesn't exist
        stageMap[defaultStageId].prospects.push(prospect);
      }
    });

    // Sort columns by sort_order from deal_stages
    const sortedColumns = Object.values(stageMap).sort((a, b) => {
      const stageA = dealStages.find(stage => stage.id === a.id);
      const stageB = dealStages.find(stage => stage.id === b.id);
      return (stageA?.sort_order || 0) - (stageB?.sort_order || 0);
    });

    setColumns(sortedColumns);
  }, [prospects, dealStages]);

  /** Handle drag-and-drop */
  const handleDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newColumns = [...columns];
    const sourceCol = newColumns.find((c) => c.id === source.droppableId)!;
    const destCol = newColumns.find((c) => c.id === destination.droppableId)!;

    // Move prospect
    const [moved] = sourceCol.prospects.splice(source.index, 1);
    destCol.prospects.splice(destination.index, 0, moved);
    setColumns(newColumns);

    // Notify & persist
    toast.success(
      `${moved.first_name} ${moved.last_name} moved to ${destCol.title}`,
    );
    await updateProspectDealStage(moved.id, destCol.id);
  };

  if (isLoading) {
    return <div className="card p-8 text-center">Loading prospects…</div>;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {columns.map((column) => (
            <StatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              prospects={column.prospects}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProspectStatusBoard;
