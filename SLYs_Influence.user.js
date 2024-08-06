// ==UserScript==
// @name         SLY's Influence
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  try to take over the world!
// @author       You
// @match        https://game.influenceth.io/
// @require      https://unpkg.com/axios@latest/dist/axios.min.js
// @require      https://raw.githubusercontent.com/ImGroovin/SLYs-Influence/main/starknet-browserified.js
// @require      https://raw.githubusercontent.com/ImGroovin/SLYs-Influence/main/influence-browserified.js
// @require      https://raw.githubusercontent.com/ImGroovin/SLYs-Influence/main/starknetkit-browserified.js
// @require      https://raw.githubusercontent.com/ImGroovin/SLYs-Influence/main/elasticbuilder-browserified.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=influenceth.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        unsafeWindow
// ==/UserScript==

(async function() {
    'use strict';

    function wait(ms) {	return new Promise(resolve => {	setTimeout(resolve, ms); }); }

    const influenceRPC = 'https://rpc.nethermind.io/mainnet-juno/v0_7?apikey=BFKavEXM1fl4Hvk0ATUGfJ1krG46Zq7yNAKuBrAcluHTvrX2';
    const provider = new BrowserStarknet.starknet.RpcProvider({ nodeURL: influenceRPC });
    const influenceDispatherAddress = '0x0517567ac7026ce129c950e6e113e437aa3c83716cd61481c6bb8c5057e6923e';
	const influenceDispatherContract = new BrowserStarknet.starknet.Contract(BrowserInfluence.influencesdk.starknetContracts.Dispatcher, influenceDispatherAddress, provider);
    const globalSettings = await getStoredValue('GlobalSettings');
    console.log('SLY globalSettings: ', globalSettings);
    const axiosConfig = { baseURL: 'https://api.influenceth.io', headers: {} };
    if (globalSettings.apiToken) axiosConfig.headers = { Authorization: `Bearer ${globalSettings.apiToken.token}`};
    const axiosInstance = axios.create(axiosConfig);
    const influenceUser = {
        crews: {},
        buildings: {},
        getByID(type, id) {
            let result = this[type][id];
            return result;
        },
    };
    const buildingTypes = [
		'EMPTY_LOT',
		'WAREHOUSE',
		'EXTRACTOR',
		'REFINERY',
		'BIOREACTOR',
		'FACTORY',
		'SHIPYARD',
		'SPACEPORT',
		'MARKETPLACE',
		'HABITAT'
	];
    const permissionTypes = [
        '',
        'USE_LOT',
        'RUN_PROCESS',
        'ADD_PRODUCTS',
        'REMOVE_PRODUCTS',
        'STATION_CREW',
        'RECRUIT_CREWMATE',
        'DOCK_SHIP',
        'BUY',
        'SELL',
        'LIMIT_BUY',
        'LIMIT_SELL',
        'EXTRACT_RESOURCES',
        'ASSEMBLE_SHIP'
    ];
    const buildingPermissionTypes = {
        WAREHOUSE: [3,4],
        EXTRACTOR: [12],
        REFINERY: [2],
        BIOREACTOR: [2],
        FACTORY: [2],
        SHIPYARD: [2,13],
        SPACEPORT: [2,7],
        MARKETPLACE: [8,9,10,11],
        HABITAT: [5,6]
    };
    let starknetAccount, starknetAccountAddress;

    const STARKNET_DISPATCHER = "0x0422d33a3638dcc4c62e72e1d6942cd31eb643ef596ccac2351e0e21f6cd4bf4";
    const STARKNET_SWAY_TOKEN = "0x004878d1148318a31829523ee9c6a5ee563af6cd87f90a30809e5b0d27db8a9b"

    async function getLotAgreements(crewIds, crewDelegatedTo) {
        const esb = BrowserESB.esb;
        const lotQueryBuilding = esb.boolQuery();
        lotQueryBuilding.should([
            esb.boolQuery().must([
                esb.termsQuery('meta.asteroid.Control.controller.id', crewIds),
                esb.boolQuery().should([
                    esb.nestedQuery().path('PrepaidAgreements').query(esb.existsQuery('PrepaidAgreements')),
                ])
            ]),
            esb.nestedQuery().path('PrepaidAgreements').query(esb.termsQuery('PrepaidAgreements.permitted.id', crewIds)),
        ]);

        const lotQ = esb.requestBodySearch();
        lotQ.query(lotQueryBuilding);
        lotQ.from(0);
        lotQ.size(10000);
        let lotQueryResponse = await axiosInstance.post(`/_search/lot`, lotQ.toJSON());
        return lotQueryResponse.data.hits.hits.map(lot => lot._source);
    }

    async function getControlledBuildings(crewIds, account) {
        const esb = BrowserESB.esb;
        const buildingQueryBuilder = esb.boolQuery();
        buildingQueryBuilder.should(
            esb.termsQuery('Control.controller.id', crewIds),
        );

        const buildingQ = esb.requestBodySearch();
        buildingQ.query(buildingQueryBuilder);
        buildingQ.from(0);
        buildingQ.size(10000);
        let buildingQueryResponse = await axiosInstance.post(`/_search/building`, buildingQ.toJSON());
        return buildingQueryResponse.data.hits.hits.map(bldg => bldg._source);
    }

    async function getOwnedCrews(account) {
        let ownedCrews = await axiosInstance.get(`/v2/entities?match=Crew.delegatedTo%3A"${account}"&label=1`);
        return ownedCrews.data;
    }

    async function getBuildingsByLot(lotIds) {
        console.log('getBuildingsByLot - lotIds: ', lotIds);
        const esb = BrowserESB.esb;
        const buildingQueryBuilder = esb.boolQuery();
        buildingQueryBuilder.should(
            esb.termsQuery('Location.location.id', lotIds),
        );

        const buildingQ = esb.requestBodySearch();
        buildingQ.query(buildingQueryBuilder);
        buildingQ.from(0);
        buildingQ.size(10000);
        let buildingQueryResponse = await axiosInstance.post(`/_search/building`, buildingQ.toJSON());
        return buildingQueryResponse.data.hits.hits.map(bldg => bldg._source);
    }

    async function buildExtendPrepaidAgreement(lotData) {
        let daysInSeconds = 86400 * lotData.days;
        let rate = lotData.rate * 24 * lotData.days;
        let rawVars = {
            "target": {
                "id": lotData.lotID,
                "label": 4
            },
            "permission": 1,
            "permitted": {
                "id": lotData.borrowerCrewID,
                "label": 1
            },
            "caller_crew": {
                "id": lotData.borrowerCrewID,
                "label": 1
            },
            "added_term": daysInSeconds,
            "recipient": lotData.lotController,
            "termPrice": rate
        };
        let memo = [
            lotData.lotUUID,
            1,
            lotData.borrowerCrewUUID
        ];
        const systemCall1 = BrowserInfluence.influencesdk.System.getTransferWithConfirmationCall(lotData.lotController, rate, memo, STARKNET_DISPATCHER, STARKNET_SWAY_TOKEN);
        const systemCall2 = BrowserInfluence.influencesdk.System.getRunSystemCall('ExtendPrepaidAgreement', rawVars, STARKNET_DISPATCHER, false);
        return {calls: [systemCall1, systemCall2], rate: rate};
    }

    async function buildWhitelistUpdate(bldgId, permId) {
        let bldgData = influenceUser.buildings[bldgId];
        let newWhitelistObj = await getStoredValue('WhitelistAccounts');
        let curWhitelist = bldgData.currentWhitelist.filter(x => x.permission == permId).map(x => x.permitted.toLowerCase());
        let newWhitelist = newWhitelistObj.accounts.map(x => x.toLowerCase());
        let addList = newWhitelist.filter(x => !curWhitelist.includes(x));
        let removeList = curWhitelist.filter(x => !newWhitelist.includes(x));

        let systemCalls = [];

        for (let addItem of addList) {
            let addVars = {
                "target": {
                    "id": parseInt(bldgId),
                    "label": 5
                },
                "permission": parseInt(permId),
                "caller_crew": {
                    "id": parseInt(bldgData.controller),
                    "label": 1
                },
                "permitted": addItem
            };
            let systemCallAdd = BrowserInfluence.influencesdk.System.getRunSystemCall('WhitelistAccount', addVars, STARKNET_DISPATCHER, false);
            systemCalls.push(systemCallAdd);
        }

        for (let removeItem of removeList) {
            let removeVars = {
                "target": {
                    "id": parseInt(bldgId),
                    "label": 5
                },
                "permission": parseInt(permId),
                "caller_crew": {
                    "id": parseInt(bldgData.controller),
                    "label": 1
                },
                "permitted": removeItem
            };
            const systemCallRemove = BrowserInfluence.influencesdk.System.getRunSystemCall('RemoveAccountFromWhitelist', removeVars, STARKNET_DISPATCHER, false);
            systemCalls.push(systemCallRemove);
        }

        return systemCalls;
    }

    function getLotIndex(lotID) {
        const split = 2 ** 32;
        return {
            asteroidId: lotID % split,
            lotIndex: Math.floor(lotID / split)
        }
    }

    function getLotID(lotIndex, asteroidID=1) {
        let lotID = Number(asteroidID) + Number(lotIndex) * 2 ** 32;
        return lotID
    }

    async function getStoredValue(key) {
		const storedValueJson = await GM.getValue(key, '{}');
		return JSON.parse(storedValueJson);
    }

    async function setStoredValue(key, param, value) {
        let storedValue = getStoredValue(key);
        storedValue[param] = value;
        await GM.setValue(key, JSON.stringify(storedValue));
    }

    function jwtDecode(token) {
        let jwtPayloadEncoded = token.split('.')[1];
        let jwtPayloadCleaned = jwtPayloadEncoded.replace(/=/g, '').replace(/-/g, '+').replace(/_/g, '/');
        let jwtPayloadDecoded = decodeURIComponent(atob(jwtPayloadCleaned).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jwtPayloadDecoded);
    }

    async function userSignIn() {
        await wait(2000); // naive wait for wallet to load

        const connectors = [];
        connectors.push(new BrowserStarknetkit.starknetkitInjected.InjectedConnector({ options: { id: 'argentX', provider }}));

        const connectionOptions = {
            dappName: 'Influence',
            modalMode: false ? 'neverAsk' : 'alwaysAsk',
            modalTheme: 'dark',
            projectId: 'influence',
            connectors,
            provider
        };

        globalThis.starknet_argentX = unsafeWindow.starknet_argentX;
        const starknetWalletObj = await BrowserStarknetkit.starknetkit.connect(connectionOptions);
        await wait(1000);
        starknetAccount = starknetWalletObj.wallet.account;
        starknetAccountAddress = BrowserInfluence.influencesdk.Address.toStandard(starknetAccount.address);

        if (!(globalSettings.apiToken) || (globalSettings.apiToken && globalSettings.apiToken.expiration < Date.now())) {
            // Get message (with nonce) to be signed by user
            const loginRequestResponse = await axiosInstance.get(`/v2/auth/login/${starknetAccountAddress}`);
            let loginMessage = loginRequestResponse.data.message;

            // Request signature
            let signature;
            try {
                signature = await starknetAccount.signMessage(loginMessage);
            } catch (e) {
                signature = await starknetAccount.walletProvider?.account.signMessage(loginMessage);
            }

            // Get auth token for Influence API
            const loginVerifyResponse = await axiosInstance.post(`/v2/auth/login/${starknetAccount.address}`, { signature: signature.join(',')});
            let apiToken = loginVerifyResponse.data.token;
            //config.headers = { Authorization: `Bearer ${apiToken}`};
            axiosInstance.defaults.headers = { Authorization: `Bearer ${apiToken}`};
            let apiTokenDecoded = jwtDecode(apiToken);
            await setStoredValue('GlobalSettings', 'apiToken', {token: apiToken, expiration: apiTokenDecoded.exp * 1000});
        }
    }

    function buildPermissionField(permissionType, permissionIndex) {
        let bldgPermLabel = document.createElement('span');
        bldgPermLabel.classList.add('sly-label');
        bldgPermLabel.style.fontSize = '10px';
        bldgPermLabel.style.verticalAlign = 'middle';
        bldgPermLabel.innerHTML = permissionTypes[permissionType];
        let bldgPermLabelDiv = document.createElement('div');
        bldgPermLabelDiv.appendChild(bldgPermLabel);

        let bldgPermInput = document.createElement('input');
        bldgPermInput.classList.add(`sly-bldg-permission-${permissionIndex}`);
        bldgPermInput.setAttribute('type', 'checkbox');
        bldgPermInput.dataset.permissionId = permissionType;
        bldgPermInput.style.verticalAlign = 'middle';
        bldgPermInput.checked = false;
        let bldgPermInputDiv = document.createElement('div');
        bldgPermInputDiv.style.marginRight = '20px';
        bldgPermInputDiv.style.marginLeft = 'auto';
        bldgPermInputDiv.appendChild(bldgPermInput);

        let bldgPermDiv = document.createElement('div');
        bldgPermDiv.style.display = 'flex';
        bldgPermDiv.style.flexDirection = 'row';
        //bldgPermDiv.classList.add('flex-row');
        bldgPermDiv.appendChild(bldgPermLabelDiv);
        bldgPermDiv.appendChild(bldgPermInputDiv);

        let bldgPermPrimaryTd = document.createElement('td');
        bldgPermPrimaryTd.appendChild(bldgPermDiv);

        return bldgPermPrimaryTd;
    }

    async function addBuildingRow(bldgData, bldgId) {
        let bldgRow = document.createElement('tr');
        bldgRow.classList.add('sly-bldg-row');
        bldgRow.dataset.buildingId = bldgId;

        let bldgName = document.createElement('span');
        bldgName.innerHTML = bldgData.name;
        let bldgNameTd = document.createElement('td');
        bldgNameTd.appendChild(bldgName);

        let bldgAsteroid = document.createElement('span');
        bldgAsteroid.innerHTML = bldgData.asteroid;
        let bldgAsteroidTd = document.createElement('td');
        bldgAsteroidTd.appendChild(bldgAsteroid);

        let bldgLot = document.createElement('span');
        bldgLot.innerHTML = bldgData.lot;
        let bldgLotTd = document.createElement('td');
        bldgLotTd.appendChild(bldgLot);

        let bldgType = document.createElement('span');
        bldgType.innerHTML = bldgData.type;
        let bldgTypeTd = document.createElement('td');
        bldgTypeTd.appendChild(bldgType);

        let bldgLotControlled = document.createElement('span');
        bldgLotControlled.innerHTML = bldgData.lotControlled;
        let bldgLotControlledTd = document.createElement('td');
        bldgLotControlledTd.appendChild(bldgLotControlled);

        bldgRow.appendChild(bldgNameTd);
        bldgRow.appendChild(bldgAsteroidTd);
        bldgRow.appendChild(bldgLotTd);
        bldgRow.appendChild(bldgTypeTd);
        bldgRow.appendChild(bldgLotControlledTd);

        let permIdx = 1;
        for (let permission of bldgData.permissionTypes) {
            bldgRow.appendChild(buildPermissionField(permission, permIdx));
            permIdx++;
        }

        let targetElem = document.querySelector('#slyPermissionTable');
        targetElem.appendChild(bldgRow);
    }

    async function slyLeaseModalToggle() {
        let targetElem = document.querySelector('#slyLeaseModal');
        if (targetElem.style.display === 'none') {
            targetElem.style.display = 'block';
            let totalCostPerDay = 0;
            let totalSyncCost = 0;
            let soonestEndingExtended = 0;
            let currentTime = Date.now()/1000;
            let lotLeaseDaysElem = document.querySelector('#lotLeaseDays');
            let lotLeaseCostElem = document.querySelector('#lotLeaseCost');
            let lotCountElem = document.querySelector('#lotCount');
            let lotLeaseSyncElem = document.querySelector('#lotLeaseSync');
            let lotLeaseExtendElem = document.querySelector('#lotLeaseExtend');

            let ownedCrews = await getOwnedCrews(starknetAccountAddress);
            let ownedCrewIDs = ownedCrews.map(crew => crew.id);
            let lotAgreements = await getLotAgreements(ownedCrewIDs, starknetAccountAddress);
            let soonestEnding = lotAgreements.reduce((prev, current) => (prev && prev.PrepaidAgreements[0].endTime < current.PrepaidAgreements[0].endTime) ? prev : current, 0);
            totalCostPerDay = lotAgreements.reduce((prev, current) => prev + current.PrepaidAgreements[0].rate * 24, 0) / 1e6;
            lotCountElem.textContent = lotAgreements.length;
            lotLeaseCostElem.textContent = totalCostPerDay * lotLeaseDaysElem.value;
            let controllerIDs = lotAgreements.map(agreement => agreement.meta.asteroid.Control.controller.id);
            controllerIDs = [...new Set(controllerIDs)].join(",");
            let lotOwners = await axiosInstance.get(`/v2/entities?id=${controllerIDs}&label=1`);
            let lotData = [];

            lotLeaseDaysElem.addEventListener('input', () => {
                soonestEndingExtended = Math.max(soonestEnding.PrepaidAgreements[0].endTime - currentTime, 0) + 60*60*24*lotLeaseDaysElem.value;
                totalSyncCost = lotAgreements ? lotAgreements.reduce((prev, current) => prev + (current.PrepaidAgreements[0].rate * 24) * Math.max(Math.floor((soonestEndingExtended - (current.PrepaidAgreements[0].endTime - currentTime))/(60*60*24)),0), 0) / 1e6 : 0;
                lotLeaseCostElem.textContent = lotLeaseSyncElem.checked ? totalSyncCost : totalCostPerDay * lotLeaseDaysElem.value;
            });
            lotLeaseSyncElem.addEventListener('change', () => {
                soonestEndingExtended = Math.max(soonestEnding.PrepaidAgreements[0].endTime - currentTime, 0) + 60*60*24*lotLeaseDaysElem.value;
                totalSyncCost = lotAgreements ? lotAgreements.reduce((prev, current) => prev + (current.PrepaidAgreements[0].rate * 24) * Math.max(Math.floor((soonestEndingExtended - (current.PrepaidAgreements[0].endTime - currentTime))/(60*60*24)),0), 0) / 1e6 : 0;
                lotLeaseCostElem.textContent = lotLeaseSyncElem.checked ? totalSyncCost : totalCostPerDay * lotLeaseDaysElem.value;
            });
            lotLeaseExtendElem.addEventListener('click', async () => {
                lotLeaseExtendElem.disabled = true;
                for (let lot of lotAgreements) {
                    let syncDays = Math.max(Math.floor((soonestEndingExtended - (lot.PrepaidAgreements[0].endTime - currentTime))/(60*60*24)),0);
                    let extendDays = lotLeaseSyncElem.checked ? syncDays : lotLeaseDaysElem.value;
                    let controller = lotOwners.data.find(owner => owner.id == lot.meta.asteroid.Control.controller.id);
                    let recipient = controller.Crew.delegatedTo;
                    if (extendDays > 0 && lot.Location.location.id == 1) lotData.push({lotID: lot.id, lotUUID: lot.uuid, lotController: controller.Crew.delegatedTo, borrowerCrewID: lot.PrepaidAgreements[0].permitted.id, borrowerCrewUUID: lot.PrepaidAgreements[0].permitted.uuid, rate: lot.PrepaidAgreements[0].rate, days: extendDays});
                }
                let extendPrepaidAgreementCalls = [];
                let callsSubgroup = [];
                let totalRate = 0;
                for (let lot of lotData) {
                    let {calls, rate} = await buildExtendPrepaidAgreement(lot);
                    totalRate += rate;
                    if (callsSubgroup.length <= 98) {
                        callsSubgroup = callsSubgroup.concat(calls);
                    } else {
                        extendPrepaidAgreementCalls.push(callsSubgroup);
                        callsSubgroup = [];
                    }
                };
                if (callsSubgroup.length > 0) extendPrepaidAgreementCalls.push(callsSubgroup);
                console.log('extendPrepaidAgreementCalls: ', extendPrepaidAgreementCalls);
                console.log('totalRate: ', totalRate / 1e6);
                for (let call of extendPrepaidAgreementCalls) {
                    await starknetAccount.execute(call);
                }
                lotLeaseExtendElem.removeAttribute('disabled');
                slyLeaseModalToggle();
            });
        } else {
            targetElem.style.display = 'none';
        }
    }

    async function slyPermissionModalToggle() {
        let targetElem = document.getElementById('slyPermissionModal');
        if (targetElem.style.display === 'none') {
            targetElem.style.display = 'block';
            let whitelistAccountsObj = await getStoredValue('WhitelistAccounts');
            let whitelistAccounts = whitelistAccountsObj.accounts ? whitelistAccountsObj.accounts : [];
            let whitelistSelectDivElem = document.getElementById('whitelistSelectDiv');
            let whitelistOptStr = '';
            whitelistAccounts.forEach((account) => {whitelistOptStr += '<option value="' + account + '">' + account + '</option>';});
            let whitelistSelect = document.getElementById('whitelistSelect');
            if (whitelistSelect !== null) {
                whitelistSelect.innerHTML = whitelistOptStr;
            } else {
                whitelistSelect = document.createElement('select');
                whitelistSelect.id = 'whitelistSelect';
                whitelistSelect.size = Math.min(10, whitelistAccounts.length + 1);
                whitelistSelect.multiple = true;
                whitelistSelect.style.width = '100%';
                whitelistSelect.style.padding = '2px 10px';
                whitelistSelect.innerHTML = whitelistOptStr;
                whitelistSelectDivElem.append(whitelistSelect);
            }
            let whitelistCountElem = document.getElementById('whitelistCount');
            whitelistCountElem.textContent = whitelistAccounts.length;

            let addBtn = document.getElementById('addItemBtn');
            addBtn.addEventListener('click', function() {
                let newAcct = document.getElementById('whitelistNew');
                if (!whitelistAccounts.includes(newAcct.value.toLowerCase())) {
                    whitelistAccounts.push(newAcct.value.toLowerCase());
                    let whitelistSelect = document.getElementById('whitelistSelect');
                    let newOption = document.createElement('option');
                    newOption.value = newOption.text = newAcct.value.toLowerCase();
                    whitelistSelect.append(newOption);
                    whitelistSelect.size = Math.min(10, whitelistAccounts.length + 1);
                    setStoredValue('WhitelistAccounts', 'accounts', whitelistAccounts);
                }
                newAcct.value = '';
                whitelistCountElem.textContent = whitelistAccounts.length;
            });

            let removeBtn = document.getElementById('removeItemBtn');
            removeBtn.addEventListener('click', function() {
                let removeAcct = document.getElementById('whitelistSelect');
                let selectedValues = Array.from(removeAcct.selectedOptions).map(({ value }) => value);
                whitelistAccounts = whitelistAccounts.filter(item => !selectedValues.includes(item));
                setStoredValue('WhitelistAccounts', 'accounts', whitelistAccounts);
                Array.from(removeAcct.selectedOptions).forEach(item => removeAcct.remove(item.index));
                whitelistCountElem.textContent = whitelistAccounts.length;
            });

            let checkAll1 = document.getElementById('slyPermission1SelectAll');
            checkAll1.addEventListener('click', function() {
                let perm1Elems = document.querySelectorAll('.sly-bldg-permission-1');
                perm1Elems.forEach(elem => elem.checked = checkAll1.checked);
            });

            let checkAll2 = document.getElementById('slyPermission2SelectAll');
            checkAll2.addEventListener('click', function() {
                let perm2Elems = document.querySelectorAll('.sly-bldg-permission-2');
                perm2Elems.forEach(elem => elem.checked = checkAll2.checked);
            });

            let checkAll3 = document.getElementById('slyPermission3SelectAll');
            checkAll3.addEventListener('click', function() {
                let perm3Elems = document.querySelectorAll('.sly-bldg-permission-3');
                perm3Elems.forEach(elem => elem.checked = checkAll3.checked);
            });

            let checkAll4 = document.getElementById('slyPermission4SelectAll');
            checkAll4.addEventListener('click', function() {
                let perm4Elems = document.querySelectorAll('.sly-bldg-permission-4');
                perm4Elems.forEach(elem => elem.checked = checkAll4.checked);
            });

            let ownedCrews = await getOwnedCrews(starknetAccountAddress);
            let ownedCrewIDs = ownedCrews.map(crew => crew.id);
            let controlledBuildings = await getControlledBuildings(ownedCrewIDs, starknetAccountAddress);
            for (let bldg of controlledBuildings) {
                let lotIndex = getLotIndex(bldg.Location.location.id);
                let buildingType = buildingTypes[bldg.Building.buildingType];
                let buildingName = bldg.Name ? bldg.Name.name : `${buildingType} #${bldg.id}`;
                let permissionTypes = buildingPermissionTypes[buildingType];
                let lotControlled = ownedCrewIDs.includes(bldg.meta.lotUser.id) ? true : false;
                let buildingData = {name: buildingName, asteroid: lotIndex.asteroidId, lot: lotIndex.lotIndex, type: buildingType, lotControlled: lotControlled, controller: bldg.Control.controller.id, permissionTypes: permissionTypes, currentWhitelist: bldg.WhitelistAccountAgreements};
                influenceUser.buildings[bldg.id] = buildingData;
                addBuildingRow(buildingData, bldg.id);
            }

            let permissionUpdateElem = document.querySelector('#permissionUpdate');
            permissionUpdateElem.addEventListener('click', async () => {
                permissionUpdateElem.disabled = true;
                let permUpdateList = document.querySelectorAll('.sly-bldg-permission-1:checked, .sly-bldg-permission-2:checked, .sly-bldg-permission-3:checked, .sly-bldg-permission-4:checked');
                let whitelistCalls = [];
                let callsSubgroup = [];
                for (let perm of permUpdateList) {
                    let permId = perm.dataset.permissionId;
                    let bldgRow = perm.closest('.sly-bldg-row');
                    let bldgId = bldgRow.dataset.buildingId;
                    let calls = await buildWhitelistUpdate(bldgId, permId);
                    if (callsSubgroup.length <= 98) {
                        callsSubgroup = callsSubgroup.concat(calls);
                    } else {
                        whitelistCalls.push(callsSubgroup);
                        callsSubgroup = [];
                    }
                }
                if (callsSubgroup.length > 0) whitelistCalls.push(callsSubgroup);
                console.log('whitelistCalls: ', whitelistCalls);
                for (let call of whitelistCalls) {
                    await starknetAccount.execute(call);
                }
                permissionUpdateElem.disabled = false;
                slyPermissionModalToggle();
            });
        } else {
            targetElem.style.display = 'none';
            document.querySelectorAll('#slyPermissionModal .sly-modal-body table .sly-bldg-row').forEach(e => e.remove());
        }
    }

    async function slyBlacklistModalToggle() {
        let targetElem = document.getElementById('slyBlacklistModal');
        if (targetElem.style.display === 'none') {
            targetElem.style.display = 'block';

            let blacklistLotsObj = await getStoredValue('BlacklistLots');
            let blacklistLotsStored = blacklistLotsObj.lots ? [...new Set(blacklistLotsObj.lots)].join(",") : '';
            let blacklistElem = document.getElementById('blacklistTargets');
            blacklistElem.value = blacklistLotsStored;
            let enableBtn = document.getElementById('blacklistEnable');
            enableBtn.addEventListener('click', async () => {
                enableBtn.disabled = true;
                let blacklistLots = blacklistElem.value.split(",").map(Number);
                setStoredValue('BlacklistLots', 'lots', blacklistLots);
                let lotIDs = blacklistLots.map(lot => getLotID(Number(lot)));
                let results = await getBuildingsByLot(lotIDs);
                let blacklistNames = results.map(bldg => bldg.Name.name);
                console.log('blacklistNames: ', blacklistNames);
                new MutationObserver(function(mutations, observer) {
                    let targetElem = document.querySelectorAll('div > div > label > span');
                    if (targetElem.length > 0) {
                        for (let mutation of mutations){
                            if (mutation.addedNodes.length > 0) {
                                let targetSpans = mutation.addedNodes[0].querySelectorAll('div > div > label > span');
                                if (targetSpans[0] && targetSpans[0].innerText === 'Permitted Inventories') {
                                    let tableRows = mutation.addedNodes[0].querySelectorAll('table tr');
                                    let targetRow = Array.from(tableRows).find(row => {
                                        let targetTd = row.querySelector('td:nth-child(2)');
                                        if (targetTd && blacklistNames.includes(targetTd.innerText)) return row;
                                    });
                                    if(targetRow) targetRow.style.display = 'none';
                                    new MutationObserver(function(tableMutations, tableObserver) {
                                        let tableRows = mutation.addedNodes[0].querySelectorAll('table tr');
                                        let targetRow = Array.from(tableRows).find(row => {
                                            let targetTd = row.querySelector('td:nth-child(2)');
                                            if (targetTd && blacklistNames.includes(targetTd.innerText)) return row;
                                        });
                                        if(targetRow) targetRow.style.display = 'none';
                                        tableObserver.disconnect();
                                    }).observe(mutation.addedNodes[0].querySelector('table > tbody'), {childList: true});
                                }
                            }
                        }
                    }
                }).observe(document.querySelector('body'), {childList: true});
                await wait(2000);
                enableBtn.removeAttribute('disabled');
            });
        } else {
            targetElem.style.display = 'none';
        }
    }

    let observer = new MutationObserver(waitForLoad);
    function waitForLoad(mutations, observer){
        let elemTrigger = '#root > main > div:nth-child(2) > #topMenu';
        if(document.querySelectorAll(elemTrigger).length > 0 && !document.getElementById("assistContainer")) {
            document.getElementById("assistContainerIso") && document.getElementById("assistContainerIso").remove();
            observer && observer.disconnect();
            let targetElem = document.getElementById("timeMenu");
            let slyContainer = document.createElement('div');

            let slyPrimaryColor = 'rgb(54, 167, 205)';
            let slyPrimaryColor20 = 'rgba(54, 167, 205, 0.2)';
            let slyDisabledColor = 'rgb(100, 100, 100)';
            let slyCSS = document.createElement('style');
            slyCSS.innerHTML = `.sly-btn {border: 2px solid white; background: none; color: white; cursor: pointer; margin-left: 2px; margin-right: 2px;}
            .sly-btn-primary {border-color: ${slyPrimaryColor}; color: ${slyPrimaryColor};}
            .sly-btn-primary:disabled {border-color: ${slyDisabledColor}; color: ${slyDisabledColor}; cursor: not-allowed;}
            .sly-menu {position: absolute; display: none; bottom: 42px; margin-left: 10px; background-color: rgb(41, 41, 48); min-width: 120px; box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2); z-index: 2;}
            .sly-menu.show {display: block;}
            .sly-menu button {width: 100%; text-align: left;}
            .sly-menu-btn {color: ${slyPrimaryColor}; padding: 12px 16px; text-decoration: none; display: block; background-color: rgb(41, 41, 48); border: none;}
            .sly-menu-btn:hover {background-color: ${slyPrimaryColor20};}
            .sly-btn-close:hover, .sly-btn-close:focus {font-weight: bold; text-decoration: none; cursor: pointer;}
            .sly-modal {display: none; position: fixed; z-index: 2; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);}
            .sly-modal-content {position: relative; display: flex; flex-direction: column; background-color: rgb(41, 41, 48); margin: auto; padding: 0; border: 1px solid #888; width: 785px; min-width: 450px; max-width: 85%; height: auto; min-height: 50px; max-height: 85%; overflow-y: auto; overflow-x: auto; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); -webkit-animation-name: animatetop; -webkit-animation-duration: 0.4s; animation-name: animatetop; animation-duration: 0.4s;}
            .sly-modal-header {display: flex; align-items: center; padding: 2px 16px; background-color: ${slyPrimaryColor20}; border-bottom: 2px solid ${slyPrimaryColor}; color: ${slyPrimaryColor};}
            .sly-modal-header-right {color: ${slyPrimaryColor}; margin-left: auto !important; font-size: 20px;}
            .sly-modal-body {padding: 2px 16px; font-size: 12px;}
            .flex-row {display: flex; flex-direction: row; column-gap: 25px; flex-wrap: wrap;}
            .flex-column {display: flex; flex-direction: column; row-gap: 7px; flex: 1;}
            .sly-label {padding-right: 10px;}`;

            let slyLeaseModal = document.createElement('div');
			slyLeaseModal.classList.add('sly-modal');
			slyLeaseModal.id = 'slyLeaseModal';
			slyLeaseModal.style.display = 'none';
			let slyLeaseModalContent = document.createElement('div');
			slyLeaseModalContent.classList.add('sly-modal-content');
            slyLeaseModalContent.style.width = '560px';
			slyLeaseModalContent.innerHTML = `<div class="sly-modal-header"><span style="padding-left: 15px;">SLY's Influence v${GM_info.script.version} - Lot Lease Management</span><div class="sly-modal-header-right"><span class="sly-btn-close">x</span></div></div><div class="sly-modal-body flex-column"><div class="flex-row">The "Sync Expiration" checkbox synchronizes all agreements with the soonest ending lease.</div><div class="flex-row" style="margin-left: 25%;"><div style="flex-basis: 40%;"><span class="sly-label">Days To Extend</span><input id="lotLeaseDays" type="number" min="0" max="365" placeholder="1" value="1"></input></div><div><span class="sly-label">Sync Expiration</span><input id="lotLeaseSync" type="checkbox"></input></div></div><div class="flex-row" style="margin-left: 25%;"><div style="flex-basis: 40%;"><span class="sly-label">Lot Count:</span><span id="lotCount"></span></div><div><span class="sly-label">SWAY Cost:</span><span id="lotLeaseCost"></span></div></div><div class="flex-row" style="justify-content: flex-end"><div><button id="lotLeaseExtend" class="sly-btn sly-btn-primary sly-label">Extend</button></div></div></div>`;
			slyLeaseModal.append(slyLeaseModalContent);

            let slyPermissionModal = document.createElement('div');
			slyPermissionModal.classList.add('sly-modal');
			slyPermissionModal.id = 'slyPermissionModal';
			slyPermissionModal.style.display = 'none';
			let slyPermissionModalContent = document.createElement('div');
			slyPermissionModalContent.classList.add('sly-modal-content');
            slyPermissionModalContent.style.width = '1200px';
			//slyPermissionModalContent.innerHTML = `<div class="sly-modal-header"><span style="padding-left: 15px;">SLY's Influence v${GM_info.script.version} - Building Permission Management</span><div class="sly-modal-header-right"><span class="sly-btn-close">x</span></div></div><div class="sly-modal-body flex-column"></div>`;
            slyPermissionModalContent.innerHTML = `<div class="sly-modal-header"><span style="padding-left: 15px;">SLY's Influence v${GM_info.script.version} - Building Permission Management</span><div class="sly-modal-header-right"><span class="sly-btn-close">x</span></div></div><div class="sly-modal-body flex-column"><div style="max-width: 100%;"><input id="whitelistNew" type="text" style="width: 375px;"><button id="addItemBtn" class="sly-btn sly-btn-primary">Add</button></div><div style="max-width: 100%;"><div id="whitelistSelectDiv"></div><div style="display: flex;"><div style="margin-left: auto;"><span>Count: </span><span id="whitelistCount" style="padding: 0 20px 0 10px"></span><button id="removeItemBtn" class="sly-btn sly-btn-primary">Remove</button></div></div></div><table id="slyPermissionTable"><tr><td>Building</td><td>Asteroid</td><td>Lot#</td><td>Type</td><td>Lot Controlled</td><td><div style="display: flex; flex-direction: row;"><div><span style="verticalAlign: middle;">Permission 1<span></div><div style="margin-right: 20px; margin-left: auto;"><input id="slyPermission1SelectAll" type="checkbox" style="verticalAlign: middle;"></input></div></div></td><td><div style="display: flex; flex-direction: row;"><div><span style="verticalAlign: middle;">Permission 2<span></div><div style="margin-right: 20px; margin-left: auto;"><input id="slyPermission2SelectAll" type="checkbox" style="verticalAlign: middle;"></input></div></div></td><td><div style="display: flex; flex-direction: row;"><div><span style="verticalAlign: middle;">Permission 3<span></div><div style="margin-right: 20px; margin-left: auto;"><input id="slyPermission3SelectAll" type="checkbox" style="verticalAlign: middle;"></input></div></div></td><td><div style="display: flex; flex-direction: row;"><div><span style="verticalAlign: middle;">Permission 4<span></div><div style="margin-right: 20px; margin-left: auto;"><input id="slyPermission4SelectAll" type="checkbox" style="verticalAlign: middle;"></input></div></div></td></tr></table><div class="flex-row" style="justify-content: flex-end"><div><button id="permissionUpdate" class="sly-btn sly-btn-primary sly-label">Update</button></div></div></div>`;
			slyPermissionModal.append(slyPermissionModalContent);

            let slyBlacklistModal = document.createElement('div');
			slyBlacklistModal.classList.add('sly-modal');
			slyBlacklistModal.id = 'slyBlacklistModal';
			slyBlacklistModal.style.display = 'none';
			let slyBlacklistModalContent = document.createElement('div');
			slyBlacklistModalContent.classList.add('sly-modal-content');
            slyBlacklistModalContent.style.width = '560px';
			slyBlacklistModalContent.innerHTML = `<div class="sly-modal-header"><span style="padding-left: 15px;">SLY's Influence v${GM_info.script.version} - Blacklist Management</span><div class="sly-modal-header-right"><span class="sly-btn-close">x</span></div></div><div class="sly-modal-body flex-column"><div class="flex-row">Blacklisted warehouses will not be shown in the Destination warehouse list.</div><div><span class="sly-label">Enter lot IDs in a comma separated list</span></div><div><input id="blacklistTargets" placeholder="e.g. 1111111,2222222,3333333" size="70"></input></div><div class="flex-row" style="justify-content: flex-end"><div><button id="blacklistEnable" class="sly-btn sly-btn-primary sly-label">Enable Blacklist</button></div></div></div>`;
			slyBlacklistModal.append(slyBlacklistModalContent);

            let slyMenuContainer = document.createElement('div');
			slyMenuContainer.classList.add('sly-menu');
			slyMenuContainer.addEventListener('click', function() {slyMenuContainer.classList.remove('show');});

            let slyMainButton = document.createElement('button');
			slyMainButton.id = 'slyMainBtn';
			slyMainButton.classList.add('sly-btn','sly-btn-primary');
			slyMainButton.addEventListener('click', function() {slyMenuContainer.classList.toggle('show');});
			let slyMainButtonSpan = document.createElement('span');
			slyMainButtonSpan.innerText = `SLY's Influence`;
			slyMainButtonSpan.style.fontSize = '14px';
			slyMainButton.appendChild(slyMainButtonSpan);

            let slyLeaseButton = document.createElement('button');
			slyLeaseButton.id = 'slyLeaseBtn';
			slyLeaseButton.classList.add('sly-btn','sly-menu-btn');
			slyLeaseButton.addEventListener('click', function() {slyLeaseModalToggle();});
			let slyLeaseButtonSpan = document.createElement('span');
			slyLeaseButtonSpan.innerText = 'Lot Leases';
			slyLeaseButtonSpan.style.fontSize = '14px';
			slyLeaseButton.appendChild(slyLeaseButtonSpan);

            let slyPermissionButton = document.createElement('button');
			slyPermissionButton.id = 'slyPermissionBtn';
			slyPermissionButton.classList.add('sly-btn','sly-menu-btn');
			slyPermissionButton.addEventListener('click', function() {slyPermissionModalToggle();});
			let slyPermissionButtonSpan = document.createElement('span');
			slyPermissionButtonSpan.innerText = 'Permissions';
			slyPermissionButtonSpan.style.fontSize = '14px';
			slyPermissionButton.appendChild(slyPermissionButtonSpan);

            let slyBlacklistButton = document.createElement('button');
			slyBlacklistButton.id = 'slyBlacklistBtn';
			slyBlacklistButton.classList.add('sly-btn','sly-menu-btn');
			slyBlacklistButton.addEventListener('click', function() {slyBlacklistModalToggle();});
			let slyBlacklistButtonSpan = document.createElement('span');
			slyBlacklistButtonSpan.innerText = 'Blacklist';
			slyBlacklistButtonSpan.style.fontSize = '14px';
			slyBlacklistButton.appendChild(slyBlacklistButtonSpan);

            slyMenuContainer.appendChild(slyLeaseButton);
            slyMenuContainer.appendChild(slyPermissionButton);
            slyMenuContainer.appendChild(slyBlacklistButton);

            slyContainer.appendChild(slyCSS);
            slyContainer.appendChild(slyMainButton);
            slyContainer.appendChild(slyMenuContainer);
            slyContainer.appendChild(slyLeaseModal);
            slyContainer.appendChild(slyPermissionModal);
            slyContainer.appendChild(slyBlacklistModal);
            targetElem.prepend(slyContainer);

            let slyLeaseModalClose = document.querySelector('#slyLeaseModal .sly-btn-close');
			slyLeaseModalClose.addEventListener('click', function() {slyLeaseModalToggle();});
            let slyPermissionModalClose = document.querySelector('#slyPermissionModal .sly-btn-close');
			slyPermissionModalClose.addEventListener('click', function() {slyPermissionModalToggle();});
            let slyBlacklistModalClose = document.querySelector('#slyBlacklistModal .sly-btn-close');
			slyBlacklistModalClose.addEventListener('click', function() {slyBlacklistModalToggle();});
        }
    }
    observer.observe(document, {childList: true, subtree: true});
    waitForLoad(null, null);
    await userSignIn();
})();