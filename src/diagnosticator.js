import { Pef } from './pef.mjs';

export function diagnose(pef) {
    return checkForSummary(pef)
}

// This is for now an arbitrary number,
const AMOUNT_OF_HITS_TO_TRIGGER = 6;
function checkForSummary(pef) {
    //TODO: (alex) this should return the pages that compose
    // the summary and not true or false, that way we can
    // in the future try to extract the summary to display it

    let regexSearchStrings = [
        // NOTE: the "spaces" in the below patterns aren't actual spaces, 
        // but the "Braille Blank Pattern"

        // Pagenumber Text
        "⠼[⠁-⠿]*(⠀|\\s)[⠁-⠿]*",
        // Text Pagenumber
        "[⠁-⠿]*( |\\s)⠼[⠁-⠿]*"
    ];

    // Add first and last volumes pages to scan
    // a summary that's not at the beginning or end of a book
    // is definitely an interesting one
    var pagesToScan = [];
    for (let page of pef.body.volumes[0].sections[0].pages) {
        pagesToScan.push(page);
    };

    var lastInVolumes = pef.body.volumes.length-1;
    // TODO: (alex) ***wow*** this is not a pretty line :)
    var lastInSections = pef.body.volumes[lastInVolumes].sections.length-1;
    for (let page of pef.body.volumes[lastInVolumes].sections[lastInSections].pages) {
        pagesToScan.push(page);
    };

    for (let searchString of regexSearchStrings) {
        for (let page of pagesToScan) {
            var hits = 0;
            for (let row of page.rows) {
                var foundStrings = row.match(searchString);
                if (foundStrings) {
                    hits++;
                }
            };
            
            if (hits > AMOUNT_OF_HITS_TO_TRIGGER) {
                console.log("Unsure of page number, but summary seems to be able to be found using regex " + searchString);
                return true;
            }
        };
    };
    return false;
}