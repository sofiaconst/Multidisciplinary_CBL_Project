// Demo / testing mode — lets you manually drive all display values
// without needing a real scale connected.

export class Demo {
	private static _instance: Demo

	active              = $state(false)
	panelOpen           = $state(false)

	// Today's dashboard values
	consumedMl          = $state(1400)
	dailyTargetMl       = $state(2800)
	sipCount            = $state(12)
	avgSipMl            = $state(118)
	nextSipInMs         = $state(20 * 60 * 1000)
	consumedThisHourMl  = $state(200)
	hourlyTargetMl      = $state(350)
	reminderStatus      = $state<'off' | 'on_track' | 'sip_due' | 'target_reached'>('on_track')
	streakDays          = $state(7)

	// Weekly history (Mon → Sun, ml consumed per day)
	weekData            = $state([900, 1400, 2100, 1800, 2600, 2800, 1400])

	static getInstance(): Demo {
		if (!Demo._instance) Demo._instance = new Demo()
		return Demo._instance
	}
}

export const demo = Demo.getInstance()
