# 201-08: focused benchmark revision proposal

Prepared September 11, 2026 by Codex. EDIT-001 is a completed review packet, not lesson approval. Proposed wording below is for Dave's review. No lesson, image, widget or shared app files changed.

## Keep the lesson's strengths

Keep the unmerciful servant, the four-box diagram, the three existing mid-lesson questions, and the standard closing trio. The central aim is already coherent: receive God's mercy in Christ and extend mercy to another person. Keep the present pastoral voice and charcoal artwork; there is no reason to start over.

The next revision should improve understanding without adding length. Replace repeated explanation with clearer language and a chance to explain the picture.

## Proposed wording

**Main truth:** Because God has shown you mercy in Christ, you can begin to show that mercy to others.

**Replace the short definition of Justified throughout the lesson and widget:**

> God declares you righteous because of Jesus. You receive this gift through faith, not by earning it.

**Supporting explanation for the Justified step:**

> Jesus bore the judgment our sin deserves. When you trust Him, God forgives you and declares you righteous because of Christ. This is justification. Your acceptance rests on what Jesus has done, even while He continues to change how you live.

This is a proposed explanation within the project's existing theological direction, not a Scripture quotation. It distinguishes the verdict from the cross that makes it possible. Payment alone is an incomplete definition; the current mnemonic can make a learner think their history or ongoing sin has disappeared. Biblical anchors: [Romans 3:21-26](https://www.esv.org/Romans%2B3:21-26/) and [Crossway's explanation of justification](https://www.crossway.org/articles/10-key-bible-verses-on-justification/).

**Compact diagram labels:**

| Box | Proposed short wording | Explain in the step card |
|---|---|---|
| Mercy | God spares me deserved judgment | Compassion toward someone who cannot rescue themselves |
| Justified | God declares me righteous | Received through faith because of Jesus |
| Righteous | Christ is my right standing | Acceptance in Christ does not mean my behavior is already sinless |
| Grace | God's kindness is a gift | Acceptance and new life are unearned |

The Justified and Righteous boxes deliberately describe closely related truths: God's declaration and the standing received in Christ. Do not teach them as separate transactions. If a learner cannot explain this distinction, simplify the diagram in a later design pass rather than forcing four independent definitions. These labels need Dave's approval and actual phone layout testing.

**Caption beneath the completed diagram:**

> These are connected truths about God's gift, not steps you perform to earn it. The mercy you receive is meant to shape the mercy you give.

Keep the circle as a memory aid. Make its final movement explicitly about mercy toward others, so the arrow cannot imply that forgiving earns renewed acceptance by God. [Ephesians 2:8-10](https://www.esv.org/verses/Ephesians%2B2%3A8%E2%80%9310/) distinguishes the gift from the good works that follow it.

## Preserve the force of Jesus' story

The current retelling stops at the king's question, while later text calls the story a warning. Add a brief account of its serious ending rather than making the parable only an encouraging illustration. Explain that the unforgiving servant is a warning against refusing mercy; do not frame forgiving others as purchasing salvation. Dave should settle the exact explanation of [Matthew 18:34-35](https://www.esv.org/Matthew%2B18%3A34%3BMatthew%2B18%3A35/) before publication. The story illustrates forgiven debt and mercy; it does not itself depict another person paying the servant's debt. Introduce Christ's payment from the relevant gospel passages rather than importing that detail into the story.

Suggested application sentence: "Showing mercy does not mean calling harm good or immediately restoring trust. You can seek wise help and safe boundaries while learning to forgive." Do not turn the reflection into a request for private details about another person.

## Scripture corrections to make together

The JSON verse text and widget are separate sources today. Correct both in the eventual implementation; do not assume editing the JSON updates the diagram.

| Widget location | Observed issue | Required change |
|---|---|---|
| Header and intro, Ephesians 2:8 | Wording differs from the project's ESV standard | Use an exact, clearly labeled ESV excerpt; the opening is "For by grace you have been saved through faith." [ESV](https://www.esv.org/verses/Ephesians%2B2%3A8%E2%80%9310/) |
| Mercy card, Ephesians 2:4-5 | Wording differs from ESV, translation unspecified | Use the ESV wording, with explanation outside the quotation. [ESV](https://www.esv.org/Ephesians%2B2%3A1%E2%80%9310%3BEphesians%2B2%3A8%E2%80%9310/) |
| Justified card, Romans 5:9 | Labeled ESV but contains different wording and inserted explanations | Restore exact ESV text. Move parenthetical explanations of blood and wrath to teaching text. [ESV](https://www.esv.org/verses/Romans%2B5%3A9%3BRomans%2B5%3A10/) |
| Righteous card, 2 Corinthians 5:21 | Explicitly uses NIV while the curriculum standard is ESV | Use ESV consistently unless Dave records an intentional exception. [ESV](https://www.esv.org/Isaiah%2B53%3A10%E2%80%9312%3BRomans%2B3%3A21%E2%80%9326%3B2%2BCorinthians%2B5%3A21/) |
| Grace card, Ephesians 2:8-10 | Combines shortened and explanatory wording into a verse display | Use a labeled exact excerpt or the full passage; put the summary in ordinary teaching prose. [ESV](https://www.esv.org/verses/Ephesians%2B2%3A8%E2%80%9310/) |

This pass checks these named issues; it is not a certification of every quotation or licensing requirement in the curriculum. Keep the applicable Scripture attribution/reuse work in CHURCH-001.

## Reading and meeting flow

1. Keep the journey recap, then bring the existing image/story forward, before the long definitions. Use the parable-card convention supported by the renderer; do not break the current paired-image behavior to satisfy an assumed schema.
2. Let the learner answer 8.1, then introduce Ephesians 2 and the diagram. Keep Scripture authoritative and the story's meaning explicit.
3. Place 8.2 immediately after the diagram. Follow it with the shorter explanatory paragraphs, avoiding a second complete tour of the same five steps.
4. Keep the mercy application, 8.3, Lesson Review and closing trio. Preserve every existing question ID and its purpose.
5. In the later UX-001 prototype, provide immediate access to the completed diagram and the learner's existing next-step response. Do not store a duplicate lesson or reveal answers automatically to a discipler.

## A five-minute benchmark test

Use the revised lesson with a learner who did not help write it. Do not coach the answers first.

- Ask them to explain the completed diagram in their own words for one minute.
- Ask what justification means and whether they must become sinless or earn God's acceptance first.
- Ask why receiving mercy should change how they treat someone else.
- Ask them to find their next step on their phone and describe one realistic action.

Record only anonymous observations: what was recalled, what was confused, taps needed to find the next step, and whether help was needed. Do not collect private prayer or conflict details. Pass when they distinguish gift from earning, standing from present behavior, and can name a practical response. If they cannot, revise the wording/tool rather than adding another page of explanation.

## Implementation handoff

Dave's two editorial decisions are the proposed justification/standing wording and how to express the parable's warning alongside gospel assurance. The ESV corrections follow the already-established standard. After editorial direction is settled, implement as one coordinated lesson/widget packet, outside Grokbot's shared-code assignment. Review exact text and artwork before any publishing merge. No approval is inferred from this proposal.

Read sources: data/201-08.json, widgets/grace-diagram.html, Compass, template and the targeted baseline finding. No new browser or learner test was run for this documentation task. Earlier layout evidence is historical; any revised labels need fresh 375/390 px and laptop checks.

Source fingerprints at review:

- `data/201-08.json`: `fcc20b3f2a5e08975dbd7abc43f1be1226e9234dcbee913b1c0609b9f48f00df`

- `widgets/grace-diagram.html`: `5d57617688d3163be855c72502c405ef1d71852a443022d22f728735953bf96b`
