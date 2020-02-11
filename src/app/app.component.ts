import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	forma: FormGroup;

	constructor(private fb: FormBuilder) {
		this.forma = this.fb.group({
			sifrovan: { value: SIFROVAN_TEKST, disabled: true },
			desifrovan: { value: undefined, disabled: true }
		});
	}

	resetuj(): void {
		this.forma.reset({
			sifrovan: { value: SIFROVAN_TEKST, disabled: true },
			desifrovan: { value: undefined, disabled: true }
		});
	}

	desifruj(): void {
		const sifrovanTekst: string = this.forma.get('sifrovan').value;
		const ociscenTekst: string = this.ukloniSpecijalneKaraktere(sifrovanTekst);

		const verovatnocePojavljivanjaDesifrovan = [];
		for (let k in VEROVATNOCE_POJAVLJIVANJA_DESIFROVAN)
			verovatnocePojavljivanjaDesifrovan.push({ slovo: k, verovatnoca: VEROVATNOCE_POJAVLJIVANJA_DESIFROVAN[k] });
		verovatnocePojavljivanjaDesifrovan.sort(this.poredjenje);
		console.log(verovatnocePojavljivanjaDesifrovan);

		for (let i = 0; i < ociscenTekst.length; i++)
			SLOVA[ociscenTekst.charAt(i)]++;

		const verovatnocePojavljivanjaSifrovan = [];
		for (let k in SLOVA)
			verovatnocePojavljivanjaSifrovan.push({ slovo: k, verovatnoca: SLOVA[k] / ociscenTekst.length });
		verovatnocePojavljivanjaSifrovan.sort(this.poredjenje);
		console.log(verovatnocePojavljivanjaSifrovan);

		const nizParovaSlova = [];
		for (let i = 0; i < verovatnocePojavljivanjaDesifrovan.length; i++) {
			let najmanjaRazlika: number = 1000;
			let indeks: number = 0;
			for (let j = 0; j < verovatnocePojavljivanjaSifrovan.length; j++) {
				const razlika: number = verovatnocePojavljivanjaSifrovan[j].verovatnoca - verovatnocePojavljivanjaDesifrovan[i].verovatnoca;
				if (Math.abs(razlika) < najmanjaRazlika) {
					najmanjaRazlika = razlika;
					indeks = j;
				}
			}
			nizParovaSlova.push({
				sifrovanoSlovo: verovatnocePojavljivanjaSifrovan[indeks].slovo,
				desifrovanoSlovo: verovatnocePojavljivanjaDesifrovan[i].slovo
			});
		}
		console.log(nizParovaSlova);

		let desifrovanTekst: string = '';
		for (let i = 0; i < sifrovanTekst.length; i++) {
			const parSlova = nizParovaSlova.find(x => x.sifrovanoSlovo == sifrovanTekst[i]);
			desifrovanTekst += parSlova ? parSlova.desifrovanoSlovo : sifrovanTekst[i];
		}
		this.forma.get('desifrovan').setValue(desifrovanTekst);
		for (let key in SLOVA)
			SLOVA[key] = 0;
	}

	private ukloniSpecijalneKaraktere(tekst: string): string {
		let rezultat: string = '';
		const sveVelikaSlova: string = tekst.toUpperCase();
		const sveMalaSlova: string = tekst.toLowerCase();
		tekst.replace(/\s/g, '');
		for (let i = 0; i < tekst.length; i++)
			if (sveVelikaSlova[i] != sveMalaSlova[i])
				rezultat += tekst[i];
		return rezultat;
	}

	private poredjenje(x: { slovo: string, verovatnoca: number }, y: { slovo: string, verovatnoca: number }): number {
		const v1: number = x.verovatnoca;
		const v2: number = y.verovatnoca;
		return v1 > v2 ? -1 : v1 < v2 ? 1 : 0;
	}
}

const SLOVA: { [key: string]: number } = {
	'A': 0,
	'a': 0,
	'B': 0,
	'b': 0,
	'V': 0,
	'v': 0,
	'G': 0,
	'g': 0,
	'D': 0,
	'd': 0,
	'Đ': 0,
	'đ': 0,
	'E': 0,
	'e': 0,
	'Ž': 0,
	'ž': 0,
	'Z': 0,
	'z': 0,
	'I': 0,
	'i': 0,
	'J': 0,
	'j': 0,
	'K': 0,
	'k': 0,
	'L': 0,
	'l': 0,
	// 'Lj': 0,
	// 'lj': 0,
	'M': 0,
	'm': 0,
	'N': 0,
	'n': 0,
	// 'Nj': 0,
	// 'nj': 0,
	'O': 0,
	'o': 0,
	'P': 0,
	'p': 0,
	'R': 0,
	'r': 0,
	'S': 0,
	's': 0,
	'T': 0,
	't': 0,
	'Ć': 0,
	'ć': 0,
	'U': 0,
	'u': 0,
	'F': 0,
	'f': 0,
	'H': 0,
	'h': 0,
	'C': 0,
	'c': 0,
	'Č': 0,
	'č': 0,
	// 'Dž': 0,``
	// 'dž': 0,``
	'Š': 0,
	'š': 0,
};

const VEROVATNOCE_POJAVLJIVANJA_DESIFROVAN: { [key: string]: number } = {
	'L': 0.000281557954012201,
	'N': 0.00168934772407321,
	'O': 0.00187705302674801,
	'R': 0.001407789770061,
	'S': 0.00272172688878461,
	'a': 0.113092444861567,
	'b': 0.0169873298920695,
	'c': 0.00638198029094322,
	'd': 0.0356640075082121,
	'e': 0.0948850305021117,
	'g': 0.0190520882214923,
	'h': 0.00478648521820741,
	'i': 0.0863444392304083,
	'j': 0.0442045987799155,
	'k': 0.0296574378226185,
	'm': 0.0390427029563585,
	'n': 0.0603472548099484,
	'o': 0.102862505865791,
	'p': 0.0280619427498827,
	'r': 0.0391365556076959,
	's': 0.0442984514312529,
	't': 0.0433599249178789,
	'v': 0.0371656499296105,
	'z': 0.0167996245893947,
	'ć': 0.00647583294228062,
	'č': 0.00938526513374003,
	'đ': 0.00300328484279681,
	'š': 0.011731581417175,
	'ž': 0.00628812763960582
};

const SIFROVAN_TEKST: string = `kojnžuOuzL vn cć večć L murLNć jnce, kjpn tnanle Noe cć tnvescL mnmrLa. gc umSešL u 
anlu lnču u hemlćvcOća ojćcuoSu, ut ehNoć rćmćlOć L lnjau. DjuNore Oć pLle rćlLSe, 
aceđepjeOce, L ucnhjćv mhjćace cn luvemoL, cn anlć mlepevć, cnlntćzL mć rćz u ecea 
jntvjnRlOLrea jnmheleRćcOu u SeOć uhnvnOu mrL rnjeNncL šLa mć cnču u hjLjevL L rnc 
đjnvmSLž tLvern; u hjelćzć cnješLoe. Cćln lnčLsn cLOć aeđln vn hecćmć cn mćpL rLNć ev 
ojLvćmćonS LtlćocLSn, n SnSe mća eređ vjuNorn Seać Oć hjLhnvne cLOć pLle vjuđLž 
mSuhern, rćz emnalOćcć đemhevć LlL tnlOuplOćcLž hnjern hejćv Oćvcć anlć đjuhć 
mćlOnSn, oe mć oL OnvcLsL, utcćaLjćcL, heruSeNć hjćv mlepevea SjćoncOn, rćmćleNzu L 
đlnmcLa jntđerejLan erć pušcć đeaLlć, emonrlOnOuzL onSe erLan sće tnvcOL vće Sjern. 
Pjć cćđe Noe mć lnčn vepje L uvnlOLln ev epnlć, aćmon pćžu hevćlOćcn.
gSuhlOćc ecea cćaeđuzea LvćOea vn cćzć aezL hjćhetcnoL invaLlu, kjpn pL 
tnhncOćc OćvcLa vjuđLa eoSjLzća, ehntLrNL Oć u OćvceO đjuhL, hjefLlea eSjćcuou S 
cOćau: cć mnae Noe Ou Oć evanž hetcne (on Se L cć pL!) cćđe au mć šnS, Non rLNć, cOćc 
lLS ušLcL oelLSe L onSe hetcno, Sne vn oe cLOć mnae vjuđL huo Noe Oć rLvL u mreać RLreou, 
cćđe vn Oć oe moeoL, žLlOnvLoL huo Noe mć cnlntL u hjLmumoru cOćceđ mrćoleđ hjefLln. I on 
lnđncn, Oćvrn esjoncn lLcLOn eSjuđlć pjnvć, L onO tnjćt umon, mn SjnOćrLan anle 
tnrLOćcLa cnđejć, mn cćšLa SjrcLa, šulcLa u lnSe LmhuhšćceO vecOeO umcLsL, L onO 
cćevlušcL cem, L oe rćlLSe mLre eSe, murLNć rćlLSe tn oe anle lLsć, L onO hjnaćc Semć cn 
mlćhea eSu, lnS Sne vnž, oehnl L juaćc ev mucsn, L on hetn, onSe aćSncn, onSe oLžn, 
cnv revea SeOn mć onlnmn, mrć Oć oe pLle hetcnoe ve mLocLsn kjpL. Knvn Ou Oć rLvće, Snvn 
Oć oe Lane rjćaćcn vn Oć hjeanojn ernSe vće he vće, L vn uRLrn u Oćvcea emćzncOu 
pćmSjnOcć cćRcemoL? Tn SelLSe Ouojem, ec cLOć aeđne vn OeO mć mćoL lLSn, OeN Ouojem, sćln 
cOćcn hjLlLSn pLln Oć cćužrnolOLrn, anđlerLon, pćRćzn. A mnvn moeOL hjćv cOea, L mrnSL 
vćonlO cOćcć lLšcemoL SeOL eoSjLOć, hetcno au Oć, LcoLanc, vjnđ, vnrce tcnc, vnrce 
lOuplOćc u mcerLan, vnrce anRćc u oehlć lćocOć rćšćjL, vnrce relOćc... dćaeđuzć... – 
aLmlLe Oć kjpn, – On mna Oć oćS Oušć uhetcne. Jn šnS cć tcna cL Se Oć ecn, cL evnSlć 
velntL, cL Suvn Lvć...
invaLln đn hjLaćoL L emaćžcu au mć. gc OeO hjLčć. DeS Oć pLe vnlćSe šLcLle au mć vn 
cćzć aezL uehNoć hjeđerejLoL. AlL oćS Noe mć cnčć SjnO cOć, ec emćoL rćlLSL aLj, cćNoe 
oLže L maLjćce Noe Oć lćpvćle eSe sćleđ cOćceđ Sjoeđ pLzn, Oćvnc aLj SeOL Oć helnSe 
hjćlntLe mn cOć cn cOćđn, cn cOćđerć heSjćoć. TnO aLj, huc mnvjRLcć L tcnšnOn, helnSe Oć 
mhelOn hjevLjne u cOćđeru ucuojnNcOemo, LmhucOnrne đn OćvcLa lćhLa L hlćaćcLoLa 
emćzncOća, Oćvcea rjmoea plnđeđ žuaejn, emrćolOćceđ mrćRLa hjelćocOLa mucsća. 
gvmOnOL revć, cćmonNcL, RLrL L cćmonlcL, hjćlćonlL mu he epevu cOćceđ NćNLjn L cnđcuoeđ 
lLsn. Jn đerejLa! – vLrLe mć mna mćpL kjpn, hemlć mrnSć Ltđerejćcć jćšL, – On đerejLa, 
L mjsć aL cć luhn. AlL Non ać evuNćrlOnrn oe cn cOeO, Non ać Oć Oušć oelLSe utpuvLle? U 
oea ojćcuoSu ecn hevLRć cn cOćđn ešL L Oćvnc vuđ heđlćv pL LtaćcOćc. Knvn OeO mć 
ušLcL vn Oć onO heđlćv vuđe ojnOne, vn pL aeđne pLoL ouanšćc, ecn mć cnđle tnjuaćcL L 
helnSe epejL ešL. KnSe mu OeO vuđć ojćhnrLsć! – tnSlOušL tn mćpć kjpn cć hjLaćzuOuzL 
vn Oć u oea heđlćvu, hucea heSejcemoL, šćRcOć, aLmlL L ouđć, epOnNcOćcOć sćleđ 
cOćđeređ cćaLjn. Tć ojćhnrLsć pLlć mu mrć Noe Oć ec u oea šnmu aeđne rLvćoL ev cOćcć 
lćheoć. Uemonlea, Noe Ou Oć vuRć đlćvne oe Oć mrć rLNć emćzne vn invaLln cLOć lćhn. 
gcn Oć mSeje juRcn! – utrLScu ec cnOtnv u mćpL. – Cjoć mu OeO cćhjnrLlcć, ešL L murLNć 
rćlLSć L SjeoSć, cem anlL L maćNnc. AlL mrć oe cLOć aeđle vn au uancOL hjre emćzncOć, 
emćzncOć plnRćcmorn, mjćzć, heohucemoL, pćmSjnOcemoL.
bnčn, heNoe hječć dćpeONu Sulu, eSjćcu cnOćvcea hjćan rjpnan. gđjeacn anmn 
revć, hucn eoSLcuoeđ đjncOn, rnlOnln mć mrćšnce he mrćau oeać hjemojncmoru, 
heSejćcea u OćvceO pujceO cezL L mnvn vjRncea hev oLa auocLa L RuzSnmoLa onlnmLan. 
dn Sjeru tnrlnvn cćepLšce rćmćlOć Snvn lnčn hjćčć Ltcnv aćmon đvć Oć pLe cnmLh L 
tnhlerL šLmoLcea SeOu Oć LrLšLle oćS etćlćcćle vjrćzć. Vevn Oć u oea SjnOu pLln aLjcn, 
mSeje cćheSjćocn, vjrćzć Oć pLle ehSelOćce RpucOća ev Seđn mu rLjLlL mnae jnmhuhćlL 
rjžerL, aLjLmnln Oć mćcSn, mrćR lLmo, rlnđn, mruvn ucneSele, Sjet šćmonj, veSlć Oć eSe 
aeđle vehjćoL, plLmonln mć herjNLcn revć, cnpejncn ervć-ecvć oeSea, LlL mhnlea 
đjncea šLOć Oć lLNzć L đjncšLsć vevLjuOu; pLle Oć, mća oeđn, SjLSern vLrlOLž hlerSL, 
NlOuSn, Oćvceđ hjLđuNćceđ nlL uRujpnceđ RLreon SeOL mć emćzne mruvn L Seać Oć mSeje 
maćone Nua ćlLmć, Seać Oć maćone šnans Ltaćču vjrćzn, cnoernjćc mrćRLa lLmcLSea, 
cn Seać NSjLhć rćlLSn L oćNSn rćmln. Šon Oć vnrnle mrea oea hćOmnRu, jnrcea aćčuoLa, 
mruvn Lmoea, ou RćmoeSu L RLru lćheou? Jć lL oe pLle hjelćzć L cer lLmo, OeN cć urćS 
heohuce jntrLOćc L lćhlOLr? IlL Oć utpučLrnln LvćOn cćepLšcemoL, on Snonmojefn u hjLjevL, on 
tćalOn morejćcn tn mešcć hnNcOnSć, hjćSjLrćcn mnvn revea he SeOeO hlerL lnčn? dn 
hjćvcOća vćlu Sjern cćSe Oć LtrLOne cn žnjaecLsL "MLjOnce, jumć Semć vnO vn oL 
tnajmLa"... L aćlevLOn Oć SlLtLln, hjemon Sne vćšLOć mlLSć, cnLrcn L ouRcn, onSe ouRcn.
– ZnNoe cnN cnjev evanž hnvn u aćlncželLOu šLa Oć mjćznc, LlL uRLrn u cćšćau? – 
uhLon cnOćvcea invaLln.
kjpn tn ojćcuonS cć uaćvć vn evđerejL cn oe hLoncOć, nlL Oć rjle vepje emćzne vn rćz 
cćSelLSe ojćcuonSn cćNoe pelce L mlnoSe moćRć cOćđere mjsć.
– Jn pLž relće vn mna mnvn deOć, L vn ere cLOć anln LtlćocLšSn lnčn, rćz Keršćđ 
Znrćon, – hjeđerejL ec cnOtnv. – ZnaLmlLoć, LanoL mrć RLreoLcOć eređn mrćon L pLoL ut oe 
mn... – ec mć tnvjRn.
– KnSrn šuvcn LvćOn! – utrLScu invaLln rćmćle. – Znj rnan L onSrć LvćOć velntć 
hecćSL huo cn hnaćo?
– Delntć. A Noe mć oLšć aćlncželLOć... On rna ou cLNon cć pLž uaće epOnmcLoL. Jn mna 
tnhnaoLe mređn uOnSn khnmeOn, anoćjLceđ pjnon, SeOL cLOć uaće vn uRLrn cn vjuđL 
cnšLc cćđe mn mrLjSea L u mutnan. I On mna hecćSL huo emćoLa onSe heojćpu, Snvn mna 
L murLNć mjćznc, tn cćSea ouRpnlLsea, tn cćSea hćmaea SeOn pL aL đerejLln e 
hjelntcemoL, e cćvetrelOćcea, e cćrćjcea... vn ecvn, emćoLrNL ouđu, Noe đjšćrLoLOć 
uRLrna u oeO mjćzL, u jnmheleRćcOu, u mrLjsL... Sne ešnOcLS. dć uaća vn epOnmcLa, oe Oć 
onSe Oćvcn rjmon heojćpć. BLe mna u Lcemojncmoru, u FjncsumSeO L ŠrnOsnjmSeO. Eoe, onae 
mć mrćo jnvuOć, Lvć mupeoea L cćvćlOea u helOć, nlL, BeRć aeO, mnr onO cOLžer maćž, 
Nnhsn-lnhsn, đjnaefec, mrć Oć oe onSe hnaćoce... L ouRce. dL Oćvcć šnNć cć jntpLOu... cL 
Oćvnc utvnž cć humoć, Sne vn Oć RLreo hnjoLOn hLScLSn. dć, cLSnv cć pLž relće vn onae 
đejć RLrLa... monlce.
– Jćl oć, – hjćSLvć invaLln eru cćcnvcu Lmherćmo, – tnNoe moć eNnanjLlL eceđ anleđ 
MnjOncerLzn?
kjpn cć cnčć vn Oć oe hLoncOć anle cćepLšce. gc mlćRć jnaćcLan.
– TnSe. MeRvn pL pLle rLNć jćvn u evcemLan, Snvn pL lOuvL šćNzć hjLpćđnrnlL oeać 
mjćvmoru.
– I rnm, mnvn, cLOć... ecnSe, hecćSL huo, mojnž?
– Čćđn?
– Pn cOćđer eons...
– Bnž! gons! Jn cć tnrLmLa ev cOćđn.
– AlL u mornjL, onO jntleđ pLe Oć cLNonrnc, vn pL rL tpeđ cOćđn eoLNlL oelLSe vnlćSe.
dOLžerL mć heđlćvL hecere mjćoeNć. kjpn hjrL eSjćoć heđlćv cn Nuau Lmhev šLOćđ mć 
đjncOn lnčLsn hjerlnšLln. Kne u HelncvLOL, – heaLmlL, – revn tćlćcn, vjrćzć u tćlćcLlu, L 
đejć tćlćce cćpe hjeNnjnce pćlLa eplnsLan.
– VL mć cć lOuoLoć Noe rnm e oeać hLona?
– dć. ČuvLa mć mnae tnNoe rnm mrć oe tncLan. I ecvn, eoSuv tcnoć mrć oć heOćvLcemoL?
– Detcnln mna Lž. dćđe oe Oć mrćOćvce. dnOrLNć ać tncLan tnNoe moć au hjre vepnsLlL 
vn pL pelOć pLle vn šurn mreOć relerć. KnSrć relerć? VL moć LanlL LtjncLOć mn cOLa 
SnSru mrnču?
– Tn cć! – cnmaćOn mć cnOtnv kjpn tnpnrlOćc invaLlLcLa uhejmorea. gcvn, heNoe 
anle hjeaLmlL: – MeRvn Lanoć hjnre. dć mrnču, mn cOLa cLmna Lane cLSnSrLž rćtn, nlL 
Oćvcu rjmou tlć relOć... Oćmo, tlć relOć Lane mna hjćan cOćau. Dn Oć pLe cćSe vjuđL 
aeRvn đn cć pLž cL veonSne. AlL aelLa rnm, onO LmoL đemhevLc MnjOncerLz, veS Oć pLe u 
đLacntLOL cnhLmne Oć u Oćvcea mrea hLmaćcea tnvnoSu, vn pL heSntne mreOć tcncOć 
mjhmSLž hemlerLsn, uaćmoe: Beđ Oć mhej nlL vemoLRnc – Ve Oć mhej nlL vemoLRnc. MeRćoć 
aLmlLoL SnSe Oć onO tnvnonS pLe mješćc L u Sea hjnrsu jntrLOćc, Snvn Oć oćan đlnmLln: 
jntrLoL Oćvcu cnjevcu hemlerLsu. ItutćrNL hjrć eanNSć, L Snvn mć hjLaL hemonrSn vn Oć 
re mhej nlL vemoLRnc, emonle Oć mrć pLle leđLšce, heohuce leđLšce, L šnS mn hnoćoLSea L 
jćoejLSea leđLšce, Oćj u cnNeO LmoejLOL on hlćaćcLon veanzn RLreoLcOn tpLlOn tnutLan 
Oćvce rćlLSe L mlnrce aćmoe!... – kjpn mć pćNć tnOnhujLe. gc vevnvć: – intleđ Oć u 
oeać: On relLa relerć Snvn mu cn šćoLjL ceđć, nlL cOLžeru LcSnjcnsLOu u lOuvmSea 
eplLSu cć ojhLa, hn anSnj oe pLe cć mLc, rćz đlnrea đemhevLc MnjOncerLz, mn mrLa 
mreOLa trncOLan.
ićSnrNL oe kjpn mć anle tpucL:
– dnvna mć vn rna cLOć jev?...
– g, cLOć. gc Oć mnae aeO Sutćc... vnlOcOL Sutćc.
kjpn mć heRujL mn LtrLcOnrncOća.
– gmonrLoć. Dn Lana rLNć ječnšSLž mLahnoLOn, On tnLmon cć pLž mnvn mćvćln mn rnan. AlL 
rLvLoć Lan lOuvL SeOLan Oć hecćSL huo aLle Snvn La SnSnr ječnS cnmojnvn; hjnrćvce, 
cnjnrce.
intđerej tnmonvć cn šnmnS. HnjaucLSnN Oć hemlć Oćvceđ cćmonNceđ L rćmćleđ urevn 
(oe Oć pLle Sne vn moć rLvćlL SjnOLšnS jntutvncć mćemSć mrnvpć, hev cnmaćOncLa 
cćpea, hev jnmsrćoncLa rezća, cn SelLan heSjLrćcLa NnjćcLsnan!) hecere 
jntrlnšLe vupeSć L mćocć oecerć L ut cOLž Oć Oćvnc Oćvnj L mrćR đlnm SlLtLe he đlnoSeO 
revL:
... U pnNoL aL tuapul srćon, On đn cć pćjća, 
dn tuapulu puapul hćrn, On đn cć šuOća...
invaLln vupeSe utvnžcu. I vuđe cć hjeđerejL cL jćšL cL ecn, cL kjpn. bnčn Oć LNln SjnO 
oćlćfecmSLž moupern, Ltcnv huon SeOL Oć revLe u B. kjpn tnRćlć vn oe zuoncOć heojnOć OeN 
vuđe, rjle vuđe. U oe, rLjćzL mnae mreOea SjeNcOea, heOnrL mć u SjnOu Oćvcn pjćmSrn, 
mrn u juaćcea srćou. U revL hev cOea rLvćln mć cOćcn mlLSn SeOu onlnmL jntpLNć.
– Jćmoć lL rLvćlL? – uhLon mnmrLa oLže kjpn.
gcn mnae SlLacu đlnrea L emonvć L vnlOć tnaLNlOćcn L zuolOLrn.
kćle Oć pLle heohuce heoehlOćce. VćlLSe L uNejćce, mn mreOLa NLlOnmoLa SjererLan, 
mreOLa anlLa hjetejLan, mn mreOLa šnasLan hucLa tćlćceđ đjncOn Noe hlerć Ltaćču 
Suzn, hev hnhćjOnmoLa eplnsLan, mrć Oć oe pLle lćhe LtvnlćSn, emrćolOćce mn vrć 
mrćolemoL, Oćvcć Noe hnvn evetđe, vjuđć Noe mć vLRć mn revć, heomćznOuzL cn lćhć 
želncvmSć hćOmnRć, sjoncć mLocLšnjmSL, mrćole L Nnjćce. AlL hjLNnrNL mnmrLa plLtu, aeđln 
mć rLvćoL rlnđn SeOn mć hćcOć tLverLan, ehne lćh, hjntcć mepć, mćlOnSć tnmuSncLž 
ceđnrLsn, mornjL, šnS L moeSu, hehćou cn rLmeSć napnjć, aulO SeOL puOLsn pćNć cncćln 
cn eđjnvć, cn vjrćzć, cn hjetejć. Pn LhnS, aLjLmnle Oć urćS L monlce cn hjelćzć, cn 
cćNoe cere Noe velntL, aeasL (u pćlLa SeNulOnan L tnSLzćcL tn uže alnvLa pemLlOSea 
Noe cuvć LtlćocLsLan šnasć) pLlL mu jnmheleRćcL, tnSLSeoncL, mcnRcL. Žćcć mu mn mreOLž 
hjetejn anžnlć juSnan, vjRćzL u cnjušOu pemeceđu vćsu, hlerSć mu L đumSć u 
šehejLan hlerLlć ulLsnan hjćorejćcLa u Sncnlć...
kSešLrNL u šnans L vnrNL juSu invaLlL vn pL OeO heaeđne vn mLčć, kjpn emćoL hev 
hjmoea hjmoćc. gc pnsL heđlćv rLNć anžLcnlce cćđe Lt jnvetcnlemoL. I evOćvcea, cćNoe 
cćlnđevce L eNoje hječć sćlLa cOćđerLa oćlea. knr aLj, mrn on hjemoeon mn SeOea Oć 
đerejLe, mrć oe cnanž LNšćtć. BL au šuvnc onO cOćau veolć cćhetcno emćznO. Pn Non? – 
uhLon mć cć huNonOuzL cLSnSe invaLlLcć juSć, hjLSernceđ heđlćvn tn anlL tlnonc Sjuđ 
SeOL mć epnrLOne eSe cOćceđ vuđeđ L pćleđ hjmon. gcn užrnoL cOćđer heđlćv L cćjretce 
L Rujce eojRć juSu. dn cOćcea lLsu mć esjon Oćvce tn vjuđLa SjnOcOn tnpucn L rćlLSn 
ouđn. gcn mćvć cn mceh mrćRćđ rjpeređ đjncOn, SeOL Oć u oćNSeO pnjsL mluRLe aćmoe 
SluhLsć, L hešć utpučćce cnrlnšLoL juSnrLsć. dćojćaLsć Oć đlćvnOuzL, vupeSe 
tnaLNlOćc, pejćzL mć mn oLa cćcnvcLa emćzncOća cćšćđn cćhetcnoeđ, ec mćvć SjnO cOć. 
gcn Oć đlćvnln cn vjuđu mojncu, u revu. AlL hemlć vuđć hnutć, ecn eSjćoć heđlćv cn 
cOćđn.
– VL moć vnSlć tnLmon uvnoL? – uhLon mnmrLa oLže kjpn, Sne vn oe cLOć tcne ev hjređ šnmn 
Snvn OeO Oć pLe hjćvmonrlOćc.
gcn cć evđerejL, nlL mu OeO ešL pLlć oelLSe ouRcć, oelLSe rćlLSć, oelLSe LtjntLoć, vn eređ 
huon kjpn hjrL uSlecL heđlćv. I ecvn, Se pL tcne tpeđ šćđn L SnSe, ec heaLmlL:
– Geoere...
intđerej mć cnmonrL, nlL šnjelLOn pćNć hjćSLcuon Oćvcn anln anoćjLnlcn šLcOćcLsn pLln 
Oć verelOcn (Sne vn mć u pLemSehu hjćSLcć sćluleLvcn hncolOLSn) L ev sćleđ rjoleđn 
emćzncOn, jćšL, hćOmnRn, emonOć mnae hjntce L heanle hjlOnre pLemSehmSe hlnoce, L u mnlL 
cćhetcnoL lOuvL, L he hevu Sejć ev heaejncvRL. krć pćNć hemonle vjuđeOnšLOć, jćšL mć 
ojeae eoSLvnlć, anNon mrnSL šnm pćRnln u vjuđć SjnOćrć.
Knvn mć cnOtnv sće mrćo LmSuhL cn lnčLsL, rćšć rćz pćNć cn veanSu: hćOmnR Oć pLe mnr 
ev juaćceđ L lOupLšnmoeđ, cnv herjNLcea revć u vnlOLcL vLtnln mć LtanđlLsn, mrćR rćonj 
pjLmne Oć hjćSe Sjern. kucsć mć uSntLrnle Sjet đjncOć Sne rćlLSn sjrćcn Suđln, 
eprLOćcn đejuzLa LmhnjćcOLan, hlćouzL he revL NLjeSu L plLmonru huoncOu: L he oeO 
rnojćceO montL, u đjLaLtu, u tlnou, u mrćolemoL, hlerLln Oć on anln lnčn, SlćhćzuzL mreOea 
pjplOLrea anNLcea.
kn aceđe eptLjn, jnvL šćđn OeO Oć kjpn pLe cćepLšce tnžrnlnc, invaLln mć hjLSlOušL 
vjuNoru, L oe eceO đjuhL đvć mć cnOrLNć maćOnle. gc mna emonvć cn SlOucu lnčć, mn vrn-
ojL etpLlOcLOn đemhevLcn, huNćzL L hjćojćmnOuzL hLoncOn ucuojnNcOć helLoLSć. kjpn pćNć 
hne u rćlLSu ouđu L cnOtnv, vn cć pL aejne evđernjnoL cL ušćmorernoL u jntđereju, ec 
mć herušć mnmrLa u SjnO. dnNnrNL aćmoe cn rćlLSea Seouju uRnvL, ec mć LtđupL u 
aLmlLan Lt SeOLž đn hjćcu oćS emrćolOćcL Bćeđjnv, šLOn Oć eSjćcuon mlLSn ojćhćjLln u 
sjceO rćšćjcOeO revL. I SnSe cLOć aeđne vnoL mćpL jnšucn tpeđ šćđn Oć oe mnvn mrć 
đeoere, ec umonvć lOuoLoe L, Sne vn mreOLa eomćšcLa L pjtLa heSjćoLan žoćvć vn uđuNL 
ou cćjntualOLru ouđu, ec mn rnojea hešć vn đerejL, vn mć maćOć L vn tnšLSuOć.
bnčn aćčuoLa pćNć hjLmonln; Ltlćo Oć pLe tnrjNćc.
`;
