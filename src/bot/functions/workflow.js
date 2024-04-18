import * as graph from "../../api/index.js";

export async function saveWorkflow(
  { workflow_id, name, teamId, announce, channelId },
  times = 0
) {
  const saved = await graph.createWorkflow({
    workflow_id,
    name,
    teamId,
    announce,
    channelId,
  });
  if (times > 5) {
    return null;
  }

  if (!saved) {
    return setTimeout(async () => {
      await saveWorkflow(
        { workflow_id, name, teamId, announce, channelId },
        times + 1
      );
    }, times * 1000);
  }

  return saved;
}

export async function saveBroadcast({ workflowId, channelId }, times = 0) {
  const saved = await graph.addBroadcast({ workflowId, channelId });
  if (times > 5) {
    return null;
  }

  if (!saved) {
    return setTimeout(async () => {
      await saveBroadcast({ workflowId, channelId }, times + 1);
    }, times * 1000);
  }

  return saved;
}
