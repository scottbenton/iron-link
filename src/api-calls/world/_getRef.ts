import {
  Bytes,
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import { World, WorldDocument } from "./_world.type";

export function constructWorldsPath() {
  return `/worlds`;
}

export function constructWorldDocPath(worldId: string) {
  return `/worlds/${worldId}`;
}

export function getWorldCollection() {
  return collection(
    firestore,
    constructWorldsPath(),
  ) as CollectionReference<WorldDocument>;
}

export function getWorldDoc(worldId: string) {
  return doc(
    firestore,
    constructWorldDocPath(worldId),
  ) as DocumentReference<WorldDocument>;
}

export function encodeWorld(world: World): WorldDocument {
  const { worldDescription, ...remainingWorld } = world;

  const encodedWorld: WorldDocument = {
    ...remainingWorld,
  };

  if (worldDescription) {
    encodedWorld.worldDescription = Bytes.fromUint8Array(worldDescription);
  }

  return encodedWorld;
}

export function decodeWorld(encodedWorld: WorldDocument): World {
  const { worldDescription, ownerIds, campaignGuides, ...remainingWorld } =
    encodedWorld;

  const newOwnerIds = [...ownerIds, ...(campaignGuides ?? [])];

  const world: World = {
    ...remainingWorld,
    ownerIds: newOwnerIds,
    worldDescription: worldDescription?.toUint8Array(),
    campaignGuides,
  };

  return world;
}
