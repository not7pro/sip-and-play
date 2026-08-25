# Catalog count and missing-page report

## Count summary

| Measure | Count | Interpretation |
|---|---:|---|
| PDF pages | 124 | Full PDF page count |
| Raw extracted candidates | 644 | Records returned from successful structured page extractions before exact-SKU deduplication |
| Exact-SKU duplicates removed | 22 | Duplicate candidates removed from the draft |
| Draft unique records available for website review | 622 | Current OCR-derived draft; not all fields are production-verified |
| Pages with structured extraction failures | 53 | These pages are not safely represented in the 622-record draft |
| Pages with extracted records | 68 | Pages contributing records to the draft |
| Low-confidence draft records | 464 | Require page-image review before publishing |
| Missing-SKU draft records | 42 | Require model-number verification |

## What is missing

The exact number of missing products cannot be stated from the current extraction alone because the failed pages contain scanned tables and OCR model-token counts are not reliable product counts. The minimum known gap is the set of failed pages listed below. The current website should therefore use **622 draft records only if the client accepts a review draft**, not as a claim that the PDF contains exactly 622 final products. The client’s stated target of 500 is not consistent with the current draft count; the final live count should be derived from the verified source records.

| Failed source page | OCR-visible candidate model tokens | Status |
|---:|---|---|
| 62 | ZOBLO18; ZOORSILOTA; Za-HMD; Za0visoke; ZaQ-skoaAB; Zaiiee; Zeovnaov; Zoa09; ZzQ-XRJ15LX2; za-DRS23; za0visahe; za0visihe; zaoB; zasars; zaste; ze0visoHe; zone | Needs page-level verification |
| 67 | ZQ124-02; ZQ124-03; ZQ124-04; Za124; za124; za124-29; za12408; za126-20; zaize21; zane; zara; zareea; zareent; zaret9; zarza9; zat24; zatats; zatz418; zatztor; zones | Needs page-level verification |
| 72 | 2Q199-09; za13408; za13409; zaf3406; zat3404; zat3405; zt3407 | Needs page-level verification |
| 73 | 2Q135; 2Q136; 2Q136-05; 2Q136-16; ZaN95-41; Zor9e-17; zQt136; za135; za13504; za135121; za13562; zaQ13506 | Needs page-level verification |
| 75 | 2Q140-22; ZO14028; ZQ139; za13901; za140; za14061; za43967; zat40n0; zol4o29; zowen | Needs page-level verification |
| 77 | zQ14413 | Needs page-level verification |
| 78 | ZOHKIVTC-27O; ZONKIYTC; ZOOSBWTC-I570; ZOXKGS-109; ZOXKGS-120; ZOXKGS-150; ZOXNGS-180; ZQ-W48-A04; ZQXKGS-180; ZQXKGs-181; ZW48AO2; ZaNKuvTC-1a7O; ZarKsvTe-1870; ZaxnGs-102; Zn07xe00 | Needs page-level verification |
| 79 | ZOLSDXY-110; ZapTCT4; Zona; zeny | Needs page-level verification |
| 80 | 2Q14908; Za149-09720149; Zatiest; Zav4s-05; za149; zaies2; zan5005; zane; zawo; znongaqun; zoltso5; zozzi0 | Needs page-level verification |
| 81 | ZQNDT-1860; Zanst12; Zanst44; Zas2-03720182; Zatst13; z0181-03720151; zais; zaisi0e; zaisiot; zaistc2; zaree-13; zas1-01120181; zats2; zavs2-2; zol5I03; zol5l04; zol5l05 | Needs page-level verification |
| 82 | 2QDDX-180; Z200; ZOLMDG-120; ZOSCGZTODC-1590; ZQ-BLMDG-120; ZQ-BLMDG-180; ZQ-YMDG-120; ZQ-YMDG-180; ZQ-YXSC-1201150180; ZQ4LMDG-180; ZQSCGZTODC-1850; ZaauupGao0; Zannoo-20; Zasm00-100; Zasru06-100; Zasruoo-t20; zaase-a8; zacTezr1se0; zadupG-50; zasFWDG150; zasFu00-200; zawDoe-ie; zaxwoG200; zomi06200; zwDpeao | Needs page-level verification |
| 83 | 2Q-GOGT-1590; Z0G0GT9030; ZDIRDH; ZQ-KTGQI; ZQ-SCSCJ-150; ZQAS-03; ZQECGQI-1435; ZaGaB030; Zacoct-iew; Zouw5to5; zacaaams; zacanen0; zaccoe-t250; zacos-t235; zaecacs-t20; zanssovza1ss02; zawaGzrrw; zocasene; zomesos; zoscecuin; zoscscu-it; zoxrcass000; zoxreas; zwetear-ie8 | Needs page-level verification |
| 84 | ZOVGDE; ZOVKG04; Za-wesT-180Z0; Zascsrd0; Zeaee; za-scra-12nz0; za-weok-180720; za187-01720157; za187-08; zarss-o1za1se; zascsrioonzonsoneoaon; zatsrot; zauwcpB; zol5r05; zol5r3; zol5ra2; zol5ra4; zolss5; zoss7-o77z0187; zotsroe | Needs page-level verification |
| 85 | Z0159-10; Z0189-06; ZQ-QFSN1992; ZQ-WS4-A08; Za159-13; Zamoaoizawiense; zame; zans008; zans9-1112Q159; zawseate; zois0; ztmm | Needs page-level verification |
| 86 | 2Q-27-26; ZOZK-3K; ZQ27-28; ZaQ-zT4B; ZazkSakw; Zazksawzazks; Zazr48; zazk46; zazkaa; zazkse; zazkza; zazraE; zxSakw | Needs page-level verification |
| 87 | ZQ-HC4518L; ZaQ-KSJ7019; Zavauors; zawiae; zaxctan; zone; zooreas; zoviate | Needs page-level verification |
| 88 | Z0980; ZOAE-OR; Za10004; ZaK38; z0xs470; za20002; zami08 | Needs page-level verification |
| 89 | Z0980; ZOAE-OR; Za10004; ZaK38; z0xs470; za20002; zami08 | Needs page-level verification |
| 90 | 2Q16E2; ZOIGEH; ZORA; zonaEaaoe | Needs page-level verification |
| 91 | 2Q16E2; ZOIGEH; ZORA; zonaEaaoe | Needs page-level verification |
| 92 | ZAATOSS; ZOATESI; ZQ170-26; ZaQ179 | Needs page-level verification |
| 93 | ZAATOSS; ZOATESI; ZQ170-26; ZaQ179 | Needs page-level verification |
| 94 | ZASH; Zoom; za17205; za17209; zamto; zane; zara; zarr1-09; zarre8; zarres8; zarri-st; zarria2; zarriar; zarrias; zarris0; zarrsa1; zarrtt9; zasror; zat7ao; zatrlaz; zatrzoa; zawriae; zeae; zona; zones; zor19; zorri28; zorriss | Needs page-level verification |
| 95 | Za174; ZaQ17416; za17415; zan7yoz; zanre18; zara; zarreae; zarrest; zat74-13; zatrt; zav7o49; zaxreso; zone; zoomz0yaoez | Needs page-level verification |
| 96 | ZAISWISEE; Zairem; Zonsea; zarees | Needs page-level verification |
| 97 | Z17751; ZAMIR; ZRAGIRAAIDIBAG; ZenevaRS; zairees | Needs page-level verification |
| 98 | 2Q178-06; Z179-12; ZD179-53; ZD180-48; ZQ180-39; Za180-115; Zai80-103; ZaiTea; Zaies; ZainoTs; Zaire; Zaireas; Zaite; Zaiw0-112; Zameen; Zan101; Zan8e43; Zane; Zanes; Zarmss; Zarrsi9; Zass; Zateens; Zateo-t08; Zauen; Zaureae; Zine; Zoltan; Zorseae; Zoucat; Zqueed; zairsas; zarrees; zarrsa9; zatmse; zatnetws; zatrer3; zoNt | Needs page-level verification |
| 99 | ZQ11-16; Za18119; Za182-45; Za1az21; Zataz-8; Zauen; Zawes; Zaweue; Zicmann; Zo18113; Zowes; za18224; za18227; zaisiat; zatez; zaw2o7; zhnang; zhuang; zowes | Needs page-level verification |
| 100 | ZIRk57; ZQ18434; Zaiar; Zaiatsy; Zane; Zatadz; Zatatzr7; Zatds6; Zattsl; Zoot; Zoran; Zousas; Zzoteaa; z0180-02; za1a428; zaaa; zaat; zaat38; zaieste; zaimat; zajatos; zajuda; zalatT7; zalatt6; zals449; zaman; zane; zara; zarsess; zat8ta; zatat44; zatata; zatatak; zatatos; zatmor; zatsti8; zattoy; zavatos; zoey; zoinso; zoiuso; zolah22; zone; zones; zoven-2a; zovs27 | Needs page-level verification |
| 101 | zaehas; zaiez2; zaimess; zainese; zamey; zane; zaneeae; zare801; zasassr; zatagse; zatscae; zauew; zaveso; zavwe2; zawoas; zawsor; zawss; zoes; zoletas; zones; zons1s; zoomkaa; zoreetn; zosesar; zowest | Needs page-level verification |
| 102 | 2Q187-08; Za188; z9188; zae7; zarse; zarss-t1; zas8; zase04; zate7-92; zatse; zatss; zauerar; zaw7; zemen; zest; zoner1a; zones; zousie; zoxbs | Needs page-level verification |
| 103 | za100-16; za100-19; za10045; za160-05; za180-11; za18e-12; za190; zar60-04; zare0-09; zate0-02; zateot7; zoreeo | Needs page-level verification |
| 104 | ZQ191-12; Za191-15; ZaQ191-14; Zane; Zass2-s6; zante; zare21s; zarot; zatgat | Needs page-level verification |
| 105 | ZO194-20; ZRnERARAcpe; zae415; zais18; zane; zansan7; zaorata; zasre; zatseo6; zaveet; zones | Needs page-level verification |
| 106 | ZQ195; Za1gs; Zarso1; Zat96-02; za106-6; za195; za195-06; zaive1s; zarseazstFFaarl; zatee3; zater7; zatseaafrreon; zatseattrFao; zawe-es; zawsaarreo; zo10610; zo10619; zoros | Needs page-level verification |
| 107 | ZQ198; Zari; zara; zawr2e; zawraseeraio; zeit; zones; zoos; zowe; zowo; zowronersin | Needs page-level verification |
| 108 | 2Q19013; 2Q198-47; ZawbzT; zone | Needs page-level verification |
| 109 | ZQGG1ixtntsem; Zai07-02; zasast; zast | Needs page-level verification |
| 110 | zQ204; za204; zans-i6; zans-it; zaz04; zaz04-08; zones | Needs page-level verification |
| 111 | za205-15; za20s; zaamsat; zames8; zamse; zan0s22; zaz0s; zazos; zazoste; zeeeR; zomg; zon0516; zona; zone; zones | Needs page-level verification |
| 112 | z0208-17; zaamar; zaamrse; zamrio; zouera; zouera2; zouorsn; zoxt7 | Needs page-level verification |
| 113 | ZQ-BO01 | Needs page-level verification |
| 114 | (none detected) | Needs page-level verification |
| 115 | ZQ-B003; zope | Needs page-level verification |
| 116 | ZEST2; ZQ-B005; ZQ-B8 | Needs page-level verification |
| 117 | ZQ-A010 | Needs page-level verification |
| 118 | Znonaaun | Needs page-level verification |
| 119 | ZQ-SN1544; za-sw2042; zinsmea | Needs page-level verification |
| 120 | Za-sFo4g; za-sF016; zeTmeRme; zocor; zosrozs | Needs page-level verification |
| 121 | 2QSNSITS; ZLSN6904; ZOSNH1; ZQSNSTER; Zasnsres; Zosne; Zosnsnts; Zosnsus; Zteasonn; zasusor; zeraem; zones | Needs page-level verification |
| 122 | Zari; za220; zane; zona | Needs page-level verification |
| 123 | ZaoM; zaz30 | Needs page-level verification |
| 124 | (none detected) | Needs page-level verification |

The accompanying `catalog_page_count_report.csv` contains the page-by-page audit and candidate tokens. Candidate tokens are evidence for review, not confirmed product records.
