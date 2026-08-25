import { getDatabase } from "../database";

export class BodyWeightRepository {
	// Stores a new body-weight measurement with its capture timestamp.
	async logWeight(weightKg: number): Promise<void> {
		const db = await getDatabase();
		await db.runAsync("INSERT INTO body_weight_log (logged_at, weight) VALUES (?, ?)", new Date().toISOString(), weightKg);
	}

	// Returns the latest measurement or the app's default body weight.
	async getLatest(): Promise<number> {
		const db = await getDatabase();
		const row = await db.getFirstAsync<{ weight: number }>("SELECT weight FROM body_weight_log ORDER BY logged_at DESC LIMIT 1");
		return row?.weight ?? 75;
	}

	// Retrieves all body-weight measurements in chronological order.
	async getAll(): Promise<Array<{ date: string; weight: number }>> {
		const db = await getDatabase();
		return db.getAllAsync<{ date: string; weight: number }>("SELECT logged_at AS date, weight FROM body_weight_log ORDER BY logged_at ASC");
	}
}
export const bodyWeightRepository = new BodyWeightRepository();
