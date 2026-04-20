<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Wheela marketplace application. PostHog is now initialized in `src/main.tsx` with the `PostHogProvider` and `PostHogErrorBoundary` wrapping the entire app, enabling automatic pageview tracking, session replay, and error capture out of the box.

User identification is performed at login and signup — calling `posthog.identify()` with the user's ID, email, and name so that all subsequent events are associated with a known user profile. Twelve custom business events are tracked across eight files, covering the full user journey from registration through auction bidding, listing inquiries, search, and messaging.

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via email/password login | `src/screens/loginScreen.tsx` |
| `user_signed_up` | User completed registration and created a new account | `src/screens/signUpScreen.tsx` |
| `auction_viewed` | User viewed an individual auction listing page (top of auction conversion funnel) | `src/screens/auctionScreen.tsx` |
| `auction_bid_placed` | User successfully placed a bid on an auction | `src/components/auction/auctionBidComponent.tsx` |
| `auction_bid_failed` | User attempted to place a bid but it failed | `src/components/auction/auctionBidComponent.tsx` |
| `auction_watched` | User clicked the Watch button on an auction listing | `src/screens/auctionScreen.tsx` |
| `auction_shared` | User clicked the Share button on an auction listing | `src/screens/auctionScreen.tsx` |
| `listing_viewed` | User viewed an individual vehicle listing page (top of listing conversion funnel) | `src/screens/listingScreen.tsx` |
| `listing_offer_sent` | User clicked Send Offer on a vehicle listing | `src/screens/listingScreen.tsx` |
| `listing_watched` | User clicked the Watch button on a vehicle listing | `src/screens/listingScreen.tsx` |
| `search_performed` | User performed a search with a query string | `src/screens/searchScreen.tsx` |
| `message_sent` | User sent a message in a dealer conversation | `src/screens/messages.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/390022/dashboard/1489170
- **Auction Bid Conversion Funnel** (auction viewed → bid placed): https://us.posthog.com/project/390022/insights/7lV4Yvu8
- **New User Signups (Daily)**: https://us.posthog.com/project/390022/insights/7tsg6fl2
- **Listing View → Offer Sent Funnel**: https://us.posthog.com/project/390022/insights/ipsbmcdn
- **Bid Failure Rate** (placed vs failed): https://us.posthog.com/project/390022/insights/KpOxJ6NI
- **Signup → Login → Bid Placed Full Funnel**: https://us.posthog.com/project/390022/insights/dBOFP8la

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-declarative/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
