import { workers as demoWorkers } from "../data/workers.js";

const STORAGE_KEY = "hunarly:registered-workers";

function isRegisteredWorker(worker) {
  return (
    worker &&
    typeof worker.id === "string" &&
    typeof worker.name === "string" &&
    typeof worker.profession === "string" &&
    typeof worker.category === "string" &&
    typeof worker.location === "string" &&
    typeof worker.experience === "string" &&
    typeof worker.phone === "string" &&
    typeof worker.image === "string" &&
    typeof worker.about === "string" &&
    Number.isFinite(worker.experienceYears) &&
    Number.isFinite(worker.rating) &&
    Number.isFinite(worker.reviews) &&
    Array.isArray(worker.skills) &&
    worker.skills.every((skill) => typeof skill === "string") &&
    Array.isArray(worker.services) &&
    worker.services.every((service) => typeof service === "string") &&
    Array.isArray(worker.portfolio) &&
    Array.isArray(worker.reviewsList)
  );
}

export function getRegisteredWorkers() {
  let storedValue;
  try {
    storedValue = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new Error("Hunarly could not read saved worker profiles.", {
      cause: error,
    });
  }

  if (!storedValue) return [];

  let registeredWorkers;
  try {
    registeredWorkers = JSON.parse(storedValue);
  } catch (error) {
    throw new Error("Saved worker profiles are unreadable. Please clear the Hunarly profile data and try again.", {
      cause: error,
    });
  }

  if (
    !Array.isArray(registeredWorkers) ||
    !registeredWorkers.every(isRegisteredWorker)
  ) {
    throw new Error("Saved worker profile data is invalid and could not be loaded.");
  }

  return registeredWorkers;
}

export function getAllWorkers() {
  return [...demoWorkers, ...getRegisteredWorkers()];
}

export function getWorkerById(workerId) {
  return getAllWorkers().find((worker) => worker.id === workerId);
}

export function saveWorker(worker) {
  if (!isRegisteredWorker(worker)) {
    throw new Error("The new worker profile is incomplete and could not be saved.");
  }

  const registeredWorkers = getRegisteredWorkers();
  if (
    demoWorkers.some((item) => item.id === worker.id) ||
    registeredWorkers.some((item) => item.id === worker.id)
  ) {
    throw new Error("This worker profile has already been submitted.");
  }
  const normalizedPhone = worker.phone.replace(/\D/g, "");
  if (
    demoWorkers.some((item) => item.phone.replace(/\D/g, "") === normalizedPhone) ||
    registeredWorkers.some(
      (item) => item.phone.replace(/\D/g, "") === normalizedPhone,
    )
  ) {
    throw new Error("A worker profile with this phone number is already saved.");
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...registeredWorkers, worker]),
    );
  } catch (error) {
    throw new Error(
      "Hunarly could not save this profile. The browser may not have enough local storage available.",
      { cause: error },
    );
  }

  window.dispatchEvent(new Event("hunarly:workers-updated"));
}
