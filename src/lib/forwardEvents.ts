// forwardEvents.ts
import type { Action, ActionReturn } from 'svelte/action';

// This is a generic action to forward actions to a specific element
export const forwardEvents: Action<HTMLElement, Record<string, any>> = (
	node: HTMLElement,
	events: Record<string, any>
) => {
	Object.entries(events).forEach(([eventName, eventHandler]) => {
		node.addEventListener(eventName, eventHandler);
	});

	return {
		destroy() {
			Object.entries(events).forEach(([eventName, eventHandler]) => {
				node.removeEventListener(eventName, eventHandler);
			});
		}
	};
};
