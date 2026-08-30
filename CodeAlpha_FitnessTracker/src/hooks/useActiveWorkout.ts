import { useEffect, useState } from "react";
import type { ActiveWorkout } from "@/types";
import { bodyWeightRepository } from "../database/repositories/BodyWeightRepository";
import { workoutRepository } from "../database/repositories/WorkoutRepository";
import { estimateCalories } from "@/services/CalorieService";
import { computeVolume, detectPersonalRecords } from "@/services/WorkoutService";

// Manages the live workout state, elapsed time, set editing, and completion.
export function useActiveWorkout(initial: ActiveWorkout) {
	const [activeWorkout, setActiveWorkout] = useState(initial);
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const timer = setInterval(() =>
			setSeconds((value) => value + 1), 1000);
		return () => clearInterval(timer);
	}, []);

	// Adjusts one set field while preventing values from becoming negative.
	function updateSet(exerciseIndex: number, setIndex: number, field: "weight" | "reps", delta: number) {
		setActiveWorkout((workout) => ({ ...workout, exercises: workout.exercises.map((exercise, index) => index === exerciseIndex ? { ...exercise, sets: exercise.sets.map((set, row) => row === setIndex ? { ...set, [field]: Math.max(0, set[field] + delta * (field === "weight" ? 2.5 : 1)) } : set) } : exercise) }));
	}

	// Adds a new set by copying the previous set's values for convenience.
	function addSet(index: number) {
		setActiveWorkout((workout) => ({
			...workout,
			exercises: workout.exercises.map((exercise, row) =>
				row === index ? {
					...exercise,
					sets: [...exercise.sets, { ...(exercise.sets.at(-1) ?? { weight: 0, reps: 10 }) }]
				}
					: exercise
			)
		}));
	}

	// Removes one set from the selected exercise.
	function removeSet(exerciseIndex: number, setIndex: number) {
		setActiveWorkout((workout) => ({
			...workout,
			exercises: workout.exercises.map((exercise, index) =>
				index === exerciseIndex ? {
					...exercise,
					sets: exercise.sets.filter((_, row) => row !== setIndex)
				}
					: exercise)
		})
		);
	}

	// Saves the workout and returns the calculated completion summary.
	async function finishWorkout() {
		if (!activeWorkout.exercises.some((exercise) => exercise.sets.length > 0)) {
			throw new Error("Add at least one set to save your workout.");
		}

		const bodyWeight = await bodyWeightRepository.getLatest();
		const records = await workoutRepository.getPersonalRecords();
		const best = Object.fromEntries(records.map((record) => [record.exerciseName, record.weight]));
		const newPrs = detectPersonalRecords(activeWorkout.exercises, best);
		const calories = estimateCalories(seconds, bodyWeight);
		const id = await workoutRepository.createSession(activeWorkout.name, new Date().toISOString(), seconds, calories, activeWorkout.exercises);

		return { id, durationSeconds: seconds, volumeKg: computeVolume(activeWorkout.exercises, bodyWeight), calories, newPrs };
	}

	return { activeWorkout, seconds, setActiveWorkout, updateSet, addSet, removeSet, finishWorkout };
}
