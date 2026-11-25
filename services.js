const services = [
  {
    "id": "inspection",
    "label": "Inspection",
    "title": "Surface inspection",
    "desc": "Spot the road film, grit and marks before the first drop of foam.",
    "start": 0,
    "color": "#add9ff",
    "category": "Exterior assessment",
    "steps": [
      [
        "Survey",
        "Walk around the dry vehicle under a broad light to see road film, tar spots and visible marks."
      ],
      [
        "Inspect",
        "Look closely at lower doors, bumpers and panel edges where heavier dirt collects."
      ],
      [
        "Plan",
        "Record existing marks and agree the areas that need attention before washing."
      ]
    ],
    "packages": [
      [
        "Condition check",
        0,
        5,
        "Includes the three steps shown above."
      ],
      [
        "Detailed assessment",
        15,
        20,
        "Written panel-by-panel notes."
      ]
    ],
    "heading": "Before the wash",
    "intro": "A dry walk-around reveals where road film ends and an existing mark begins. The inspection sets the scope of the visit, from a quick maintenance clean to more involved paint work.",
    "spots": [
      [
        "Bonnet",
        53,
        46,
        "Reflections from the overhead light help reveal dull patches and surface marks."
      ],
      [
        "Lower bumper",
        48,
        76,
        "The front face collects grit and impact marks. These areas are checked before any mitt touches the paint."
      ],
      [
        "Glass",
        48,
        30,
        "The windscreen and its edges are checked for film and residue before washing."
      ]
    ],
    "best": "A first visit, a car returning from winter driving, or paintwork with visible marks.",
    "scope": "Panel and trim check, identification of heavy soiling, and a discussion of priorities.",
    "limits": "Existing chips and scratches can be recorded here. Their repair is a separate job.",
    "prep": "Mention recent paint repairs, coated surfaces and any area you want left alone.",
    "question": "Can the inspection identify every mark?",
    "answer": "Heavy dirt can hide fine defects. The technician can reassess these once the surface is clean.",
    "group": "Assessment & finish"
  },
  {
    "id": "foam",
    "label": "Foam",
    "title": "Snow foam",
    "desc": "A blanket of foam loosens road grime before the contact wash.",
    "start": 3.5,
    "color": "#c7b6ff",
    "category": "Exterior pre-wash",
    "steps": [
      [
        "Coat",
        "Cover the body evenly, working around mirrors, arches and lower panels."
      ],
      [
        "Dwell",
        "Let the foam soften the film. Adjust dwell to the product and conditions and rinse before it dries."
      ],
      [
        "Check",
        "Look for remaining heavy deposits and address those areas before contact washing."
      ]
    ],
    "packages": [
      [
        "Bodywork foam",
        12,
        10,
        "Includes the three steps shown above."
      ],
      [
        "Extended pre-wash",
        27,
        25,
        "Extra attention to sills and arch lips."
      ]
    ],
    "heading": "Loosen the road film",
    "intro": "Foam clings to the surface long enough to soften loose contamination. This stage prepares the paint for rinsing and reduces the amount of loose grit left for the contact wash.",
    "spots": [
      [
        "Rear glass",
        39,
        28,
        "An even layer covers the glass and flows towards the lower edge."
      ],
      [
        "Tailgate",
        45,
        57,
        "Recesses around the badge and handle collect runoff. They are checked again during rinsing."
      ],
      [
        "Lower panels",
        69,
        70,
        "Heavier deposits often sit low on the body. The extended pre-wash gives these areas extra attention."
      ]
    ],
    "best": "Road film, dusty paint and regular exterior maintenance.",
    "scope": "Foam application over the exterior, monitored dwell time and a check of the lower panels.",
    "limits": "Foam needs a thorough rinse. Bonded contamination may still need a contact wash or separate treatment.",
    "prep": "Describe any existing wax, sealant or coating so the wash chemistry can be chosen accordingly.",
    "question": "Will the foam remove every spot?",
    "answer": "Some tar, mineral deposits and embedded particles need a separate treatment after washing.",
    "group": "Exterior"
  },
  {
    "id": "rinse",
    "label": "Rinse",
    "title": "Pressure rinse",
    "desc": "Follow the water as it carries softened dirt off the paintwork.",
    "start": 15.5,
    "color": "#95e0ff",
    "category": "Exterior wash",
    "steps": [
      [
        "Release",
        "Begin by flushing the softened foam and dirt from the upper surfaces."
      ],
      [
        "Rinse",
        "Work down the panels, rinsing recesses around handles, trim and mirrors."
      ],
      [
        "Inspect",
        "Check the lower edges for trapped suds and remaining grit before moving on."
      ]
    ],
    "packages": [
      [
        "Bodywork rinse",
        10,
        10,
        "Includes the three steps shown above."
      ],
      [
        "Extended rinse",
        25,
        25,
        "Additional wheel arch and sill flushing."
      ]
    ],
    "heading": "Clear the foam",
    "intro": "The rinse carries suspended dirt away, starting high and finishing at the lower panels. Shut lines, badges and tailgate recesses get a second look for trapped suds.",
    "spots": [
      [
        "Roof edge",
        50,
        17,
        "Runoff begins at the highest surfaces and passes over panels that still need rinsing."
      ],
      [
        "Rear glass",
        47,
        40,
        "Clear glass makes it easy to see where foam still clings around the rear wiper."
      ],
      [
        "Bumper edge",
        63,
        74,
        "The last pass clears residue along the bottom edge and around trim."
      ]
    ],
    "best": "The stage immediately following a foam pre-wash.",
    "scope": "A top-to-bottom body rinse and a visual check around exterior trim.",
    "limits": "This stage clears loosened material. A hand wash and drying can be specified separately.",
    "prep": "Tell the technician about loose mouldings, leaking seals or damaged trim.",
    "question": "Why rinse from the roof down?",
    "answer": "Runoff moves onto areas still waiting to be rinsed, which reduces repeated work on the lower panels.",
    "group": "Exterior"
  },
  {
    "id": "vacuum",
    "label": "Vacuum",
    "title": "Interior vacuum",
    "desc": "From footwells to seat seams, follow the clean into the cabin.",
    "start": 27,
    "color": "#ffc399",
    "category": "Cabin care",
    "steps": [
      [
        "Clear",
        "Remove loose rubbish and lift out the mats to expose the carpet underneath."
      ],
      [
        "Extract",
        "Vacuum the seats and footwells, using a crevice attachment around rails and seams."
      ],
      [
        "Finish",
        "Work across the mats and inspect the carpet from a second angle before refitting them."
      ]
    ],
    "packages": [
      [
        "Cabin vacuum",
        25,
        25,
        "Includes the three steps shown above."
      ],
      [
        "Deep cabin vacuum",
        40,
        40,
        "Boot floor and extended crevice work."
      ]
    ],
    "heading": "Work through the cabin",
    "intro": "Loose debris travels into seat seams, mat edges and the narrow space beside the centre console. A methodical dry vacuum works through those areas before the mats go back in.",
    "spots": [
      [
        "Footwell",
        37,
        81,
        "Lift out the mats and work the exposed carpet from more than one direction."
      ],
      [
        "Seat cushion",
        62,
        67,
        "A soft attachment follows the seams and the junction between the cushion and backrest."
      ],
      [
        "Door pocket",
        13,
        68,
        "The pocket and lower door trim receive a final check for loose debris."
      ]
    ],
    "best": "Everyday crumbs and dry dirt in the seats, mats and footwells.",
    "scope": "Seats, accessible carpet, mats and reachable crevices. The deep option adds the boot floor and extra crevice work.",
    "limits": "Wet extraction, stain treatment and extensive pet-hair removal require their own assessment.",
    "prep": "Empty storage pockets and remove valuables and personal items before the visit.",
    "question": "Does vacuuming remove stains?",
    "answer": "Vacuuming lifts loose dry debris. Staining in fibres may need a separate upholstery treatment.",
    "group": "Interior"
  },
  {
    "id": "polish",
    "label": "Polish",
    "title": "Paint polishing",
    "desc": "Watch the bonnet reflections sharpen under the studio lights.",
    "start": 49.4,
    "color": "#a5caff",
    "category": "Paint refinement",
    "steps": [
      [
        "Assess",
        "Inspect clean, prepared paint under a light and test a small area before choosing the combination."
      ],
      [
        "Refine",
        "Work in small sections with a suitable pad and polish, checking the result as you go."
      ],
      [
        "Buff",
        "Remove residue with a clean microfibre towel and inspect the reflections from another angle."
      ]
    ],
    "packages": [
      [
        "Bonnet refinement",
        60,
        50,
        "Includes the three steps shown above."
      ],
      [
        "Front panel refinement",
        75,
        65,
        "Bonnet and both front wings."
      ]
    ],
    "heading": "Refine the reflection",
    "intro": "Under directed light, fine surface marks interrupt the reflection across a dark bonnet. A test section helps establish how much improvement is realistic before the larger panel is polished.",
    "spots": [
      [
        "Inspection light",
        19,
        34,
        "The reflected strip light makes changes in gloss easier to inspect from a consistent angle."
      ],
      [
        "Working section",
        62,
        51,
        "The pad works a small section at a time after the surface has been washed and prepared."
      ],
      [
        "Panel edge",
        47,
        83,
        "The technician checks edges and changes of shape separately before the finishing wipe."
      ]
    ],
    "best": "Light swirling or a dull-looking bonnet on suitable gloss paint.",
    "scope": "Paint assessment, a test section, machine refinement of the selected panels and a residue wipe.",
    "limits": "The panel must be clean and prepared first. Deeper defects and paint repairs need separate assessment.",
    "prep": "Flag repainted panels, matte finishes, wraps and coatings before choosing a polishing service.",
    "question": "Will every scratch disappear?",
    "answer": "The result depends on the paint and defect depth. A test section shows what can be improved with the proposed process.",
    "group": "Exterior"
  },
  {
    "id": "finish",
    "label": "Finish",
    "title": "Final finish",
    "desc": "Take a last walk around the car as the lights catch the finished panels.",
    "start": 60.8,
    "color": "#ffb4cc",
    "category": "Final presentation",
    "steps": [
      [
        "Review",
        "Walk around the finished vehicle and inspect each panel from several angles."
      ],
      [
        "Touch up",
        "Check panel edges and trim for polish residue and wipe away handling marks."
      ],
      [
        "Handover",
        "Review the finished work and explain the care routine for the selected services."
      ]
    ],
    "packages": [
      [
        "Final check",
        0,
        5,
        "Includes the three steps shown above."
      ],
      [
        "Finishing detail",
        15,
        20,
        "Glass touch-up and trim wipe."
      ]
    ],
    "heading": "Review the result",
    "intro": "The final walk-around revisits the surfaces under the same studio lighting. Edges, glass and reflections are checked before the visitor receives care notes for the work selected.",
    "spots": [
      [
        "Bonnet reflection",
        52,
        48,
        "The bonnet is viewed from more than one angle to spot streaks or leftover polish."
      ],
      [
        "Front glass",
        51,
        30,
        "A final glass check highlights handling marks and residue near the edges."
      ],
      [
        "Front trim",
        48,
        76,
        "Trim joins and grille edges are inspected for product caught during the previous stages."
      ]
    ],
    "best": "The close of a detailing visit, particularly after polishing.",
    "scope": "Visual review, removal of handling marks and a handover covering the selected work.",
    "limits": "Protective wax, sealant and ceramic coating applications need a separate specification.",
    "prep": "Keep your estimate handy so each selected area can be checked at handover.",
    "question": "How should I maintain the finish?",
    "answer": "Use clean wash media and follow the aftercare directions for any specific product applied during the visit.",
    "group": "Assessment & finish"
  }
];
const valetOffers = [
  {
    "id": "mini-valet",
    "title": "Mini Valet",
    "prices": [
      70,
      80,
      90
    ],
    "times": [
      60,
      75,
      90
    ],
    "group": "valet",
    "href": "mini-valet.html",
    "packages": [
      [
        "Mini Valet",
        70,
        60,
        "A hand wash outside and a fresh cabin inside."
      ]
    ]
  },
  {
    "id": "full-valet",
    "title": "Full Valet",
    "prices": [
      135,
      150,
      170
    ],
    "times": [
      150,
      180,
      210
    ],
    "group": "valet",
    "href": "full-valet.html",
    "packages": [
      [
        "Full Valet",
        135,
        150,
        "A deeper clean for the seats, carpets and boot."
      ]
    ]
  },
  {
    "id": "headlights",
    "title": "Headlight restoration",
    "prices": [
      80,
      80,
      80
    ],
    "times": [
      120,
      120,
      120
    ],
    "group": "lights",
    "href": "extras.html#headlights",
    "packages": [
      [
        "Headlight restoration",
        80,
        120,
        "Clear cloudy outer lenses and renew their UV protection."
      ]
    ]
  },
  {
    "id": "machine-polish",
    "title": "One-step machine polish",
    "prices": [
      225,
      250,
      280
    ],
    "times": [
      180,
      210,
      240
    ],
    "group": "paint",
    "href": "extras.html#machine-polish",
    "packages": [
      [
        "One-step machine polish",
        225,
        180,
        "One machine-polishing stage to lift gloss and soften light swirls."
      ]
    ]
  },
  {
    "id": "three-step",
    "title": "Three-step compound",
    "prices": [
      450,
      490,
      540
    ],
    "times": [
      360,
      390,
      420
    ],
    "group": "paint",
    "href": "extras.html#three-step",
    "packages": [
      [
        "Three-step compound",
        450,
        360,
        "Cut, refine and finish paintwork with more visible swirling."
      ]
    ]
  }
];
