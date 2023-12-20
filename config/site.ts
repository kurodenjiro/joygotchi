export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Next.js + NextUI",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "My Pet",
			href: "/pet",
		},
		{
			label: "Leader Board",
			href: "/leaderboard",
		},
		{
			label: "Reward",
			href: "/reward",
		},
		{
			label: "Activity",
			href: "/activity",
		},
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "My Pet",
			href: "/pet",
		},
		{
			label: "Leader Board",
			href: "/leaderboard",
		},
		{
			label: "Reward",
			href: "/reward",
		},
		{
			label: "Activity",
			href: "/activity",
		},
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
	},
};
