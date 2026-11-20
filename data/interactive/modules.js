export const INTERACTIVE_HUB_PATH = "/interactive";

export const interactiveModules = ["access", "cctv", "intercom", "parking", "visitor", "platform"].map((id) => ({
	id,
	path: `${INTERACTIVE_HUB_PATH}/${id}`,
	titleKey: `interactive.modules.${id}.title`,
	descKey: `interactive.modules.${id}.desc`
}));
