import { InteractiveQuizQuestion, CliLabScenario, GlossaryItem } from './academyCurriculum';

export interface CurriculumTopic {
  title: string;
  detail: string;
  command?: string;
  tips: string;
  architectureDiagram?: string;
}

export interface CurriculumTrack {
  id: string;
  levelBadge: string;
  levelAr: string;
  levelEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  duration: string;
  estimatedHours: number;
  prerequisitesAr: string;
  prerequisitesEn: string;
  topicsAr: CurriculumTopic[];
  topicsEn: CurriculumTopic[];
  quizzes: InteractiveQuizQuestion[];
}

export const COMPREHENSIVE_QA_BANK: InteractiveQuizQuestion[] = [
  {
    id: 'qa_tcp_syn',
    categoryAr: 'بروتوكولات الشبكة والمنافذ',
    categoryEn: 'Network & Socket Protocols',
    difficulty: 'مبتدئ',
    questionAr: 'ما هي الخطوات الثلاث الدقيقة لمصافحة بروتوكول TCP الثلاثية (3-Way Handshake) لإنشاء اتصال آمن وموثوق؟',
    questionEn: 'What are the three sequential steps of the TCP 3-Way Handshake to establish a reliable stream?',
    optionsAr: [
      'SYN -> SYN-ACK -> ACK',
      'ACK -> SYN -> RST',
      'FIN -> ACK -> FIN-ACK',
      'HELLO -> AUTH -> CONNECT'
    ],
    optionsEn: [
      'SYN -> SYN-ACK -> ACK',
      'ACK -> SYN -> RST',
      'FIN -> ACK -> FIN-ACK',
      'HELLO -> AUTH -> CONNECT'
    ],
    correctIndex: 0,
    explanationAr: 'يرسل العميل أولاً حزمة مزامنة (SYN)، فيرد الخادم بحزمة تأكيد المزامنة (SYN-ACK)، ثم يؤكد العميل الاتصال بحزمة (ACK). تفعيل تقنية SYN Cookies في النواة يمنع استنزاف ذاكرة الخادم في هجمات الإغراق.',
    explanationEn: 'The client transmits SYN, server responds with SYN-ACK, and client completes with ACK. SYN Cookies safeguard host memory against backlog exhaustion.',
    hintAr: 'تبدأ بمزامنة (Synchronize) وتنتهي بتأكيد الاستلام (Acknowledge).',
    hintEn: 'Starts with Synchronize and concludes with Acknowledgement.',
    codeSnippet: 'client --[SYN, seq=x]--> server\nclient <--[SYN-ACK, seq=y, ack=x+1]-- server\nclient --[ACK, ack=y+1]--> server'
  },
  {
    id: 'qa_least_privilege',
    categoryAr: 'أمن أنظمة لينكس والنواة',
    categoryEn: 'Linux Kernel & System Security',
    difficulty: 'متوسط',
    questionAr: 'لماذا يُمنع تشغيل الخدمات وتطبيقات الويب بحساب المستخدم الجذر المطلق (root) في النظم المحصنة؟',
    questionEn: 'Why must critical web applications and services never execute under the root user in hardened environments?',
    optionsAr: [
      'لأن حساب root يبطئ معالجة حزم الشبكة بنسبة 50%.',
      'لأنه في حال استغلال أي ثغرة في التطبيق، يحصل المهاجم فوراً على سيطرة كاملة على النواة والملفات ومقابس الشبكة.',
      'لأن حساب root لا يدعم التشفير عبر بروتوكول TLS.',
      'لأن نظام لينكس يغلق حساب root تلقائياً بعد ساعتين من العمل.'
    ],
    optionsEn: [
      'Because root slows down network packet processing by 50%.',
      'Because exploiting an app flaw instantly grants the adversary total takeover of kernel, storage, and raw sockets.',
      'Because root does not support TLS cryptography.',
      'Because Linux shuts down root automatically after 2 hours.'
    ],
    correctIndex: 1,
    explanationAr: 'مبدأ الصلاحيات الأدنى (Least Privilege) يقضي بعزل العمليات داخل مستخدمين مخصصين ذوي صلاحيات مسلوبة (مثال: nobody أو مستخدم بدون shell)، مما يمنع سقوط الخادم بالكامل عند وقوع اختراق لتطبيق الويب.',
    explanationEn: 'Principle of Least Privilege confines adversaries to restricted user sandboxes, denying kernel takeover even upon arbitrary remote code execution.',
    hintAr: 'المهاجم يرث دائماً نفس صلاحيات العملية التي تم اختراقها.',
    hintEn: 'The intruder inherits the exact permissions of the compromised process.'
  },
  {
    id: 'qa_passive_osint',
    categoryAr: 'الاستخبارات وOSINT',
    categoryEn: 'OSINT & Reconnaissance',
    difficulty: 'متوسط',
    questionAr: 'ما هي الميزة التشغيلية والقانونية الأبرز للاستطلاع السلبي (Passive Reconnaissance) مقارنة بالفحص النشط؟',
    questionEn: 'What is the primary operational and legal advantage of passive reconnaissance over active vulnerability scanning?',
    optionsAr: [
      'أنه أسرع بمليون مرة من الفحص المباشر.',
      'أنه لا يرسل أي حزم مباشرة إلى خوادم الهدف، مما يجعله خفياً في السجلات ومتوافقاً مع ضوابط عدم الاشتباك والقوانين الجنائية.',
      'أنه يغني عن معرفة لغات البرمجة وبروتوكولات الشبكة.',
      'أنه يغير سجلات DNS للهدف مباشرة على خوادم الإنترنت.'
    ],
    optionsEn: [
      'It executes one million times faster than active scanning.',
      'It transmits zero packets directly to the target, remaining invisible in intrusion logs and compliant with legal engagement rules.',
      'It removes the need to understand programming languages.',
      'It automatically modifies the target DNS zone records.'
    ],
    correctIndex: 1,
    explanationAr: 'الاستطلاع السلبي يجمع البيانات من مصادر ومرايا وسيطة عامة مثل سجلات شفافية الشهادات (Certificate Transparency) ومحركات Shodan و DNS dump دون ملامسة خادم الهدف، ما يجنب الفريق الأخلاقي الوقوع في شبهة الهجوم غير المصرح به.',
    explanationEn: 'Passive reconnaissance queries third-party metadata caches without touching victim interfaces, preventing log alerts and avoiding criminal exposure.',
    hintAr: 'تذكر قاعدة عدم الاشتباك: صفر حزم تُرسل للهدف.',
    hintEn: 'Zero packets sent directly to the destination IP.'
  },
  {
    id: 'qa_nmap_syn',
    categoryAr: 'الاستطلاع وOSINT',
    categoryEn: 'OSINT & Reconnaissance',
    difficulty: 'متقدم',
    questionAr: 'كيف يعمل فحص التسلل SYN Stealth Scan (-sS) في أداة Nmap وكيف يتفادى التسجيل في سجلات طبقة التطبيقات؟',
    questionEn: 'How does Nmap SYN Stealth Scan (-sS) operate on the wire and why does it evade application logging?',
    optionsAr: [
      'يرسل حزمة SYN، وإذا رد الخادم بـ SYN-ACK يرسل Nmap حزمة RST لقطع الاتصال فوراً قبل إتمام المصافحة وتسجيل الجلسة في التطبيق.',
      'يقوم بتحميل فيروس في ذاكرة الخادم لتعطيل السجلات.',
      'يغلق جميع منافذ الضحية لمنع دخول أي مستخدم آخر.',
      'يقوم بفك تشفير شهادات SSL تلقائياً عبر ثغرة النواة.'
    ],
    optionsEn: [
      'Sends SYN, and if the target replies SYN-ACK, Nmap responds with RST to teardown the socket before completing connection or logging.',
      'Injects a payload into target memory.',
      'Closes all remote victim ports.',
      'Automatically cracks TLS certificates.'
    ],
    correctIndex: 0,
    explanationAr: 'فحص SYN يسمى "نصف المفتوح" (Half-Open) لأنه لا يكمل المصافحة الثلاثية، فبمجرد علمه بأن المنفذ مفتوح يرسل حزمة RST لإلغاء الاتصال قبل أن تنشئ طبقة التطبيقات (مثل Apache أو Nginx) سجلاً في log files.',
    explanationEn: 'Half-open SYN scans teardown the handshake with RST prior to completion, preventing application-level connection logging.',
    codeSnippet: 'nmap -sS -p 22,80,443,8080 -Pn 192.168.1.1'
  },
  {
    id: 'qa_sqli_prep',
    categoryAr: 'أمن تطبيقات الويب وقواعد البيانات',
    categoryEn: 'Web App & Database Security',
    difficulty: 'متوسط',
    questionAr: 'لماذا يعتبر استخدام الاستعلامات المجهزة (Parameterized Prepared Statements) هو العلاج الجذري لثغرات SQL Injection؟',
    questionEn: 'Why are Parameterized Prepared Statements considered the definitive mathematical remedy against SQL Injection?',
    optionsAr: [
      'لأنها تشفر قاعدة البيانات بالكامل بمفتاح سري.',
      'لأنها تفصل هيكل كود الاستعلام النحوي عن قيم المتغيرات، بحيث تُعامل مدخلات المستخدم كبيانات نصية بحتة غير قابلة للتنفيذ كأمر برمجي.',
      'لأنها تمنع المستخدمين من إدخال أي حروف خاصة في لوحة المفاتيح.',
      'لأنها تحذف أوامر DROP و DELETE من محرك قاعدة البيانات.'
    ],
    optionsEn: [
      'Because they fully encrypt the entire relational database.',
      'Because they decouple pre-compiled query syntax from input parameters, treating user variables strictly as inert literal data.',
      'Because they ban all special characters.',
      'Because they permanently erase DROP and DELETE commands from the OS.'
    ],
    correctIndex: 1,
    explanationAr: 'الاستعلامات المجهزة تترجم وتثبت شجرة النحو المنطقي للاستعلام أولاً (Abstract Syntax Tree)، ثم تقحم قيم المتغيرات لاحقاً كبيانات جامدة، فلا يمكن لأي مدخل للمستخدم أن يغير بنية الاستعلام مهما احتوى على اقتباسات أو شفرات.',
    explanationEn: 'Prepared queries compile the abstract syntax tree prior to parameter binding, rendering malicious syntax characters inert text strings.',
    hintAr: 'الفصل التام بين الكود المنفذ والبيانات المدخلة.',
    hintEn: 'Complete separation between executable code and data parameters.'
  },
  {
    id: 'qa_xss_httponly',
    categoryAr: 'أمن تطبيقات الويب وقواعد البيانات',
    categoryEn: 'Web App & Database Security',
    difficulty: 'متقدم',
    questionAr: 'ما هو الدور الدفاعي لخاصية (HttpOnly flag) عند ضبط ملفات تعريف الارتباط الخاصة بالجلسات (Session Cookies)؟',
    questionEn: 'What is the exact defensive role of the HttpOnly cookie flag in web session protection?',
    optionsAr: [
      'تسمح بنقل الكوكيز عبر شبكات الجوال اللاسلكية فقط.',
      'تمنع كود جافاسكريبت داخل المتصفح (مثل document.cookie) من قراءة الجلسة، مما يحمي الرمز من السرقة في حال وقوع ثغرة XSS.',
      'تزيد من سرعة تحميل صفحات الموقع من الخادم.',
      'تمنع المستخدم من تسجيل الخروج من حسابه.'
    ],
    optionsEn: [
      'It restricts cookie transmission exclusively to mobile cell towers.',
      'It denies browser JavaScript (document.cookie) access to the token, safeguarding session credentials from theft during XSS incidents.',
      'It speeds up web page asset caching.',
      'It prohibits user logout actions.'
    ],
    correctIndex: 1,
    explanationAr: 'خاصية HttpOnly تمنع محرك الجافاسكريبت بالمتصفح من الوصول للكوكي نهائياً، مما يحرم المهاجم من سرقة جلسة المستخدم حتى لو نجح في حقن كود خبيث عبر ثغرة XSS.',
    explanationEn: 'HttpOnly instructs browsers to isolate session cookies from document.cookie JavaScript calls, mitigating token exfiltration during XSS incidents.',
    codeSnippet: 'Set-Cookie: session_id=xyz789; Secure; HttpOnly; SameSite=Strict'
  },
  {
    id: 'qa_jwt_none',
    categoryAr: 'أمن تطبيقات الويب وقواعد البيانات',
    categoryEn: 'Web App & Database Security',
    difficulty: 'متقدم',
    questionAr: 'في هجمات تزوير رموز JWT، ما هي الثغرة المعروفة باسم "None Algorithm Attack"؟',
    questionEn: 'In JWT token authentication flaws, what constitutes the critical "None Algorithm" vulnerability?',
    optionsAr: [
      'تشفير الرمز بـ 1024 بت.',
      'قبول الخادم لرمز يحتوي في ترويسته على alg: "none" والتعامل معه كمصادقة صالحة دون التحقق من التوقيع الرقمي إطلاقاً.',
      'حذف تاريخ انتهاء صلاحية الرمز.',
      'إرسال الرمز عبر بروتوكول UDP بدلاً من TCP.'
    ],
    optionsEn: [
      'Encrypting the token payload with 1024 bits.',
      'A vulnerable server accepting alg: "none" in the JWT header, skipping cryptographic signature verification and trusting forged roles.',
      'Omitting token expiration timestamps.',
      'Transmitting the payload over UDP.'
    ],
    correctIndex: 1,
    explanationAr: 'عندما تفشل مكتبة التحقق في رفض خوارزمية "none"، يستطيع المهاجم تعديل دوره إلى "admin" وحذف التوقيع، فيقبل الخادم الرمز المصطنع. الحل السيادي يفرض تحديد خوارزميات التوقيع المسموحة صراحة في كود الخادم.',
    explanationEn: 'Vulnerable token libraries treat alg: none as valid, accepting unsigned attacker payloads. Servers must strictly enforce asymmetric algorithms.'
  },
  {
    id: 'qa_docker_privileged',
    categoryAr: 'أمن السحابة والحاويات Kubernetes',
    categoryEn: 'Cloud & Container Security',
    difficulty: 'متقدم',
    questionAr: 'ما هي الخطورة الكبرى لتشغيل حاوية Docker بالخيار المفرط (--privileged) في بيئة الإنتاج؟',
    questionEn: 'What is the critical vulnerability introduced by running a Docker container with the --privileged flag?',
    optionsAr: [
      'تستهلك الحاوية مساحة أكبر على القرص الصلب.',
      'تمنح الحاوية إمكانية الوصول المباشر لكافة أجهزة النواة وتلغي قيود seccomp و cgroups، مما يتيح الهروب من الحاوية والسيطرة على الخادم المضيف.',
      'تتوقف الحاوية عن الاتصال بالإنترنت فوراً.',
      'تمنع إضافة أي متغيرات بيئية جديدة.'
    ],
    optionsEn: [
      'The container consumes additional disk capacity.',
      'It grants raw access to all host devices and disables seccomp/cgroup boundaries, facilitating immediate container breakout into host kernel.',
      'The container loses internet connectivity.',
      'It prevents loading new environment variables.'
    ],
    correctIndex: 1,
    explanationAr: 'خيار --privileged يسقط جدران العزل بين الحاوية والمضيف، فيستطيع المهاجم تركيب أقراص الخادم الحقيقي والسيطرة على نظام التشغيل الأساسي بالكامل. المعيار السيادي يفرض الحاويات منزوعة الامتيازات (Rootless).',
    explanationEn: 'Privileged mode strips container confinement, providing raw hardware access and trivial root privilege escalation to the underlying host system.'
  },
  {
    id: 'qa_k8s_netpol',
    categoryAr: 'أمن السحابة والحاويات Kubernetes',
    categoryEn: 'Cloud & Container Security',
    difficulty: 'خبير سيادي',
    questionAr: 'ما هو السلوك الافتراضي لشبكات مجموعات Kubernetes في حال عدم تطبيق أي سياسات شبكة (NetworkPolicy)؟',
    questionEn: 'What is the default routing behavior in a Kubernetes cluster when no NetworkPolicies are defined?',
    optionsAr: [
      'كافة الحاويات معزولة تماماً ولا تستطيع التحدث مع بعضها.',
      'شبكة مسطحة ومفتوحة: كل حاوية تستطيع الاتصال بأي حاوية أخرى في أي مساحة أسماء (Namespace) دون أي قيد أو ترشيح.',
      'يُسمح فقط بحركة المرور المشفرة عبر HTTPS.',
      'تتوقف خوادم Kubernetes عن استقبال الطلبات الخارجية.'
    ],
    optionsEn: [
      'All pods operate in complete isolation without inter-pod routing.',
      'Flat network topology: every pod can communicate freely with every other pod across all namespaces without filtering.',
      'Only HTTPS encrypted traffic is routed.',
      'The cluster control plane refuses incoming ingress.'
    ],
    correctIndex: 1,
    explanationAr: 'افتراضياً شبكة كوبرنيتس مسطحة، فإذا اخترق المهاجم خدمة ويب بسيطة يستطيع التسلل جانبياً لقاعدة البيانات ولوحة التحكم ما لم تُطبق سياسات NetworkPolicy صارمة بمبدأ الحظر التلقائي (Default Deny Ingress/Egress).',
    explanationEn: 'Kubernetes features an unsegmented flat network by default. Zero-trust mandates an explicit Default-Deny ingress/egress NetworkPolicy.'
  },
  {
    id: 'qa_ebpf_xdp',
    categoryAr: 'برمجة النواة eBPF وسرعة السلك XDP',
    categoryEn: 'Kernel eBPF & XDP Defense',
    difficulty: 'خبير سيادي',
    questionAr: 'ما الذي يجعل تقنية eXpress Data Path (XDP) قادرة على إسقاط ملايين حزم الهجمات في الثانية بدون استنزاف موارد الخادم؟',
    questionEn: 'What enables eXpress Data Path (XDP) to neutralize tens of millions of attack packets per second without exhausting host resources?',
    optionsAr: [
      'أنها تعمل في برنامج تعريف بطاقة الشبكة (NIC Driver) قبل تخصيص بنية sk_buff في ذاكرة النواة وقبل استدعاء مكدس TCP/IP.',
      'أنها تستخدم الذكاء الاصطناعي لحظر خوادم الدول الخارجية.',
      'أنها تلغي حزم IPv4 تماماً.',
      'أنها تعتمد على حواسيب الكم المحمولة.'
    ],
    optionsEn: [
      'It executes verified bytecode inside the NIC driver ring buffer before socket sk_buff memory allocation and kernel network stack entry.',
      'It relies on AI to ban external domains.',
      'It completely disables IPv4 protocols.',
      'It relies on portable quantum computers.'
    ],
    correctIndex: 0,
    explanationAr: 'العبقرية في XDP تكمن في قرار الإسقاط (XDP_DROP) فور وصول البايتات إلى بطاقة الشبكة، دون تخصيص بايت واحد من ذاكرة النواة ودون إشراك مكدس الشبكة، مما يمنحها سرعة معالجة سلكية لا تضاهى تتجاوز 40M حزمة/ثانية.',
    explanationEn: 'XDP_DROP neutralizes incoming packets in the driver ring buffer before socket metadata allocation, preserving host CPU and memory completely.',
    codeSnippet: 'SEC("xdp")\nint xdp_drop_syn_flood(struct xdp_md *ctx) {\n    // Inspect headers\n    if (is_anomalous_flood) return XDP_DROP;\n    return XDP_PASS;\n}'
  },
  {
    id: 'qa_shannon_entropy',
    categoryAr: 'برمجة النواة eBPF وسرعة السلك XDP',
    categoryEn: 'Kernel eBPF & XDP Defense',
    difficulty: 'متقدم',
    questionAr: 'كيف تستفيد المنظومة من حساب إنتروبيا شانون (Shannon Entropy) لكشف برمجيات الفدية وقنوات تسريب البيانات المشفرة؟',
    questionEn: 'How do sovereign defense frameworks leverage Shannon Entropy calculations to detect active ransomware and encrypted exfiltration?',
    optionsAr: [
      'تقيس درجة الفوضى العشوائية في حزم البيانات؛ لأن الملفات المشفرة قسراً وحركات تسريب البيانات تتسم بإنتروبيا عالية جداً (تقارب 8.0) مقارنة بالبيانات العادية.',
      'تقوم بحساب عدد كلمات المرور المكتوبة باللغة العربية.',
      'تحسب المسافة الجغرافية بين الخادم والمهاجم بالأميال.',
      'تحدد سرعة دوران مروحة المعالج أثناء المعالجة.'
    ],
    optionsEn: [
      'Measures algorithmic byte distribution randomness: encrypted ransomware writes and exfiltration tunnels exhibit elevated entropy (~8.0) against benign baselines.',
      'Calculates word frequency counts.',
      'Measures physical geography between nodes in miles.',
      'Inspects CPU cooling fan RPM.'
    ],
    correctIndex: 0,
    explanationAr: 'البيانات المشفرة بالبرمجيات الخبيثة تتميز بتوزيع بايتات عشوائي متجانس يقترب من الإنتروبيا القصوى (8.0 بت لكل بايت). رصد هذا الارتفاع اللحظي يطلق إنذار العزل في أقل من 300 ميلي ثانية دون الحاجة لقواعد توقيع مسبقة.',
    explanationEn: 'High-entropy clusters (H ≈ 8.0) mathematically betray encrypted ransomware activity and covert channels without needing signature databases.',
    codeSnippet: 'H(X) = -sum(P(x_i) * log2(P(x_i)))'
  },
  {
    id: 'qa_pqc_fips203',
    categoryAr: 'التشفير المقاوم للكم PQC',
    categoryEn: 'Post-Quantum Cryptography',
    difficulty: 'خبير سيادي',
    questionAr: 'ما هي الخوارزمية الشبكية المعتمدة من المعهد الأمريكي للمعايير والتكنولوجيا (NIST) في معيار FIPS 203 لتبادل المفاتيح ضد الحواسيب الكمومية؟',
    questionEn: 'Which lattice-based algorithm was standardized by NIST in FIPS 203 (August 2024) for quantum-resistant key encapsulation?',
    optionsAr: [
      'RSA-2048',
      'ML-KEM (المعروفة سابقاً باسم Crystals-Kyber)',
      'MD5',
      'DES-56'
    ],
    optionsEn: [
      'RSA-2048',
      'ML-KEM (formerly known as Crystals-Kyber)',
      'MD5',
      'DES-56'
    ],
    correctIndex: 1,
    explanationAr: 'معيار NIST FIPS 203 اعتمد رسمياً خوارزمية ML-KEM القائمة على مشاكل الشبكات الرياضية المعقدة (Module-Lattice) التي تعجز الحواسيب الكمومية وخوارزمية شور عن كسرها، لحماية البيانات ضد خطر "احصد الآن واكسر لاحقاً".',
    explanationEn: 'NIST FIPS 203 formally ratified ML-KEM as the primary post-quantum key encapsulation mechanism, built on hard mathematical lattice problems.',
    hintAr: 'خوارزمية شبكية كانت تسمى كريستالز كايبر.',
    hintEn: 'A lattice-based mechanism formerly named Crystals-Kyber.'
  },
  {
    id: 'qa_ram_reboot',
    categoryAr: 'التحقيق الجنائي الرقمي والسيادة DFIR & DGSSI',
    categoryEn: 'Digital Forensics & Incident Response',
    difficulty: 'متقدم',
    questionAr: 'عند وقوع حادث اختراق على خادم حساس، لماذا تمنع بروتوكولات التحقيق الجنائي الرقمي (DFIR) إعادة تشغيل الخادم (Reboot) فوراً؟',
    questionEn: 'Upon detecting a major intrusion, why do digital forensic standards strictly prohibit immediately rebooting the compromised host?',
    optionsAr: [
      'لأن إعادة التشغيل تحذف بيانات الذاكرة الحية (RAM Volatile Data) حيث توجد مفاتيح التشفير، والعمليات الخفية، وعناوين اتصال المهاجم.',
      'لأن نظام التشغيل سيفقد رخصته التجارية.',
      'لأن ذلك يقلل من عمر المعالج الافتراضي.',
      'لأن إعادة التشغيل ترسل إشعاراً للمهاجم تلقائياً.'
    ],
    optionsEn: [
      'Because rebooting purges volatile RAM state, permanently destroying injection payloads, active sockets, and ephemeral cryptographic keys.',
      'Because commercial OS licenses are forfeited.',
      'Because it reduces physical CPU lifespan.',
      'Because rebooting notifies the adversary.'
    ],
    correctIndex: 0,
    explanationAr: 'ذاكرة RAM تحتوي على أهم الأدلة الجنائية المتطايرة التي لم تُكتب على القرص (مثل برمجيات التسلل غير المكتوبة Fileless Malware ومفاتيح فك التشفير). يجب أخذ صورة كاملة للذاكرة أولاً عبر أدوات مثل LiME قبل أي إيقاف.',
    explanationEn: 'Volatile RAM holds vital evidence: injected DLLs, process memory maps, and encryption keys. Acquiring memory dumps must precede any shutdown.'
  },
  {
    id: 'qa_merkle_audit',
    categoryAr: 'التحقيق الجنائي الرقمي والسيادة DFIR & DGSSI',
    categoryEn: 'Digital Forensics & Incident Response',
    difficulty: 'خبير سيادي',
    questionAr: 'كيف تضمن شجرة ميركل المشفرة (Cryptographic Merkle Tree) أن سجلات الأمان (Audit Logs) لم يتم التلاعب بها أو حذفها بعد الاختراق؟',
    questionEn: 'How does a Cryptographic Merkle Tree guarantee that security audit logs have not been retroactively altered or deleted?',
    optionsAr: [
      'بربط كل سجل ببصمة تجزئة تعتمد رياضياً على السجلات السابقة، فأي تغيير في سطر واحد يغير جذر الشجرة (Root Hash) ويفضح التلاعب فوراً.',
      'بإخفاء السجلات داخل ملف صورة سرية.',
      'بإرسال رسالة SMS للمسؤول عند كل سطر جديد.',
      'بتخزين السجلات على بطاقة ذاكرة غير قابلة للمسح فقط.'
    ],
    optionsEn: [
      'By hashing log events recursively into a cryptographic root hash; altering any historical byte mutates the tree root and exposes tampering.',
      'By steganographically concealing logs in images.',
      'By sending an SMS message per log line.',
      'By utilizing write-once flash drives only.'
    ],
    correctIndex: 0,
    explanationAr: 'شجرة ميركل توفر دليلاً رياضياً غير قابل للكسر لنزاهة البيانات؛ لأن تغيير حرف واحد في سجل قديم سيغير تجزئة العقدة وتجزئة الجذر، مما يثبت التلاعب أمام المحاكم والجهات التنظيمية.',
    explanationEn: 'Merkle trees link sequential log hashes into an immutable root. Any tampering invalidates cryptographic verification proofs instantly.'
  },
  {
    id: 'qa_dgssi_morocco',
    categoryAr: 'التحقيق الجنائي الرقمي والسيادة DFIR & DGSSI',
    categoryEn: 'Digital Forensics & Incident Response',
    difficulty: 'مبتدئ',
    questionAr: 'ما هي الجهة الوطنية العليا المسؤولة عن أمن نظم المعلومات وتحديد المعايير السيادية بالمملكة المغربية؟',
    questionEn: 'Which supreme national authority governs information systems security and sovereign cyber directives in Morocco?',
    optionsAr: [
      'المديرية العامة لأمن نظم المعلومات (DGSSI).',
      'وزارة السياحة والصناعة التقليدية.',
      'المكتب الوطني للسكك الحديدية.',
      'الهيئة العامة للضرائب فقط.'
    ],
    optionsEn: [
      'General Directorate of Information Systems Security (DGSSI).',
      'Ministry of Tourism.',
      'National Railway Office.',
      'General Tax Authority exclusively.'
    ],
    correctIndex: 0,
    explanationAr: 'المديرية العامة لأمن نظم المعلومات (DGSSI) التابعة لإدارة الدفاع الوطني هي السلطة الوطنية العليا المسؤولة عن أمن الفضاء السيبراني بالمغرب، ومركز اليقظة والرصد (maCERT) التابع لها يرصد التهديدات الوطنية.',
    explanationEn: 'DGSSI (under National Defense Administration) is the supreme authority directing national cyber defense, resilience guidelines, and the maCERT response center.',
    hintAr: 'تابعة لإدارة الدفاع الوطني.',
    hintEn: 'Under the National Defense Administration.'
  },
  {
    id: 'qa_ssrf_metadata',
    categoryAr: 'أمن السحابة والحاويات Kubernetes',
    categoryEn: 'Cloud & Container Security',
    difficulty: 'متقدم',
    questionAr: 'في ثغرات تزوير طلبات الخادم (SSRF) في البيئات السحابية (AWS/GCP/Azure)، ما هو العنوان الشهير الذي يحاول المهاجم استهدافه لسرقة رموز الدخول؟',
    questionEn: 'In Server-Side Request Forgery (SSRF) cloud vulnerabilities, which canonical IP does an attacker query to extract IAM metadata tokens?',
    optionsAr: [
      '169.254.169.254 (Instance Metadata Service)',
      '127.0.0.1 (Localhost)',
      '192.168.1.1 (Home Gateway)',
      '8.8.8.8 (Google DNS)'
    ],
    optionsEn: [
      '169.254.169.254 (Instance Metadata Service)',
      '127.0.0.1 (Localhost)',
      '192.168.1.1 (Home Gateway)',
      '8.8.8.8 (Google DNS)'
    ],
    correctIndex: 0,
    explanationAr: 'العنوان 169.254.169.254 هو عنوان خدمة بيانات تعريف السحابة (IMDSv1). إذا تمكن المهاجم من جعل الخادم يطلب هذا الرابط، يستطيع استخراج مفاتيح IAM المؤقتة والسيطرة على السحابة بالكامل. العلاج هو فرض IMDSv2 بحظر الترويسات غير المصادقة.',
    explanationEn: '169.254.169.254 hosts instance metadata. Exploiting SSRF against IMDSv1 leaks IAM credentials. Mandating IMDSv2 token sessions neutralizes this threat.',
    codeSnippet: 'curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/'
  },
  {
    id: 'qa_zero_trust',
    categoryAr: 'الفلسفة والمعمارية السيادية',
    categoryEn: 'Zero Trust & Architecture',
    difficulty: 'متوسط',
    questionAr: 'ما هو المبدأ الأساسي الذي تقوم عليه معمارية انعدام الثقة (Zero Trust Architecture - NIST SP 800-207)؟',
    questionEn: 'What is the core foundational principle underpinning Zero Trust Architecture (NIST SP 800-207)?',
    optionsAr: [
      'الثقة في كل الأجهزة الموجودة داخل الشبكة الداخلية وحظر الأجهزة الخارجية فقط.',
      '«لا تثق أبداً، وتحقق دائماً» (Never Trust, Always Verify): التعامل مع كل طلب وجهاز ومستخدم كتهديد محتمل حتى يتم التحقق المشفر اللحظي منه.',
      'إلغاء كلمات المرور واستبدالها برقم الهاتف.',
      'تشفير رسائل البريد الإلكتروني العادية فقط.'
    ],
    optionsEn: [
      'Trusting all internal devices within the corporate network and filtering only external devices.',
      '“Never Trust, Always Verify”: Treating every request, node, and user as potentially hostile until ephemeral cryptographic authentication succeeds.',
      'Eliminating passwords in favor of plain telephone numbers.',
      'Encrypting regular emails only.'
    ],
    correctIndex: 1,
    explanationAr: 'نموذج الصفر ثقة يلغي مفهوم "الشبكة الداخلية الموثوقة". كل طلب يتطلب مصادقة مستمرة وتفويضاً صريحاً وتشفير حركة البيانات حتى داخل مراكز البيانات المحلية.',
    explanationEn: 'Zero Trust eliminates the perimeter concept. Continuous micro-segmentation and ephemeral cryptographic authentication are mandatory across all transit segments.'
  },
  {
    id: 'qa_bola_idor',
    categoryAr: 'أمن تطبيقات الويب وقواعد البيانات',
    categoryEn: 'Web App & Database Security',
    difficulty: 'متقدم',
    questionAr: 'ما هي ثغرة BOLA (Broken Object Level Authorization) المصنفة رقم 1 في قائمة OWASP لواجهات الـ API؟',
    questionEn: 'What is Broken Object Level Authorization (BOLA), ranked #1 in the OWASP API Security Top 10?',
    optionsAr: [
      'فشل الخادم في التحقق مما إذا كان المستخدم المصادق يمتلك حق الوصول إلى المعرف المحدد للكائن (ID) المطلوب في الرابط.',
      'توقف قاعدة البيانات عن الاستجابة بسبب كثرة البيانات.',
      'إرسال كلمة المرور عبر البريد العادي.',
      'استخدام لغة جافاسكريبت في الواجهة الخلفية.'
    ],
    optionsEn: [
      'Server failure to validate whether the authenticated caller actually owns or has authorization to access the specific object identifier in the request.',
      'Database outage caused by excessive table rows.',
      'Transmitting passwords over standard mail.',
      'Using JavaScript on backend services.'
    ],
    correctIndex: 0,
    explanationAr: 'في ثغرة BOLA، يستبدل المستخدم المعرف /api/users/105 بـ /api/users/106، فيقوم الخادم بإرجاع بيانات المستخدم الآخر لأنه لم يتحقق من صلاحية الطلب على مستوى هذا الكائن الفردي.',
    explanationEn: 'BOLA occurs when endpoints expose object identifiers without verifying caller tenancy claims against that specific entity, leaking sensitive records.'
  }
];

export const CLI_LAB_SCENARIOS: CliLabScenario[] = [
  {
    id: 'lab_xdp_drop',
    titleAr: 'صد هجوم إغراق SYN Flood في النواة بسرعة السلك (eBPF/XDP)',
    titleEn: 'Neutralize Volumetric SYN Flood at Wire Speed with eBPF/XDP',
    categoryAr: 'برمجة النواة والدفاع السلكي',
    categoryEn: 'Kernel Defense & Wire Speed',
    difficulty: 'خبير سيادي',
    descriptionAr: 'تطبيق مسبر XDP داخل برنامج تشغيل بطاقة الشبكة لإسقاط حزم هجوم SYN Flood المليونية قبل استهلاك موارد المعالج وذاكرة النواة.',
    descriptionEn: 'Mounts an XDP program directly inside the NIC driver ring buffer to drop tens of millions of hostile SYN packets before sk_buff memory allocation.',
    command: 'bpftool prog load xdp_mitigate_syn.o /sys/fs/bpf/xdp_syn && ip link set dev eth0 xdp pinned /sys/fs/bpf/xdp_syn',
    expectedOutput: '[eBPF/XDP]: Hooked to eth0 (driver native mode).\n[MITIGATION]: 38,450,000 pkts/sec throughput capability online.\n[KERNEL ACTION]: Unsolicited SYN floods dropped at wire speed.',
    verificationRule: 'XDP_DROP executed in sub-microsecond latency. Memory backlog preserved.',
    explanationAr: 'يتم فحص ترويسة الحزمة في كابل الشبكة فوراً. إذا تبين أنها حزمة SYN عشوائية غير موثقة، يعيد المسبر رمز XDP_DROP فيُسقط البايتات دون أن تستهلك بايت واحد من الذاكرة.',
    explanationEn: 'The XDP hook operates in the driver layer, discarding malicious packets in hardware ring buffers before socket backlog starvation occurs.'
  },
  {
    id: 'lab_shannon_test',
    titleAr: 'كشف البرمجيات الخبيثة وتسريب البيانات بحساب إنتروبيا شانون',
    titleEn: 'Expose Ransomware & Data Exfiltration via Shannon Entropy',
    categoryAr: 'التحليل الرياضي وكشف الشذوذ',
    categoryEn: 'Mathematical Anomaly Detection',
    difficulty: 'متقدم',
    descriptionAr: 'حساب درجة التشتت العشوائي للبايتات (Shannon Entropy) لتمييز الملفات والأنفاق المشفرة قسراً عن حركة المرور العادية.',
    descriptionEn: 'Computes byte distribution entropy across incoming buffers to distinguish forced ransomware encryption and covert channels from benign streams.',
    command: 'python3 -c "import math, sys; data = sys.stdin.buffer.read(); ent = -sum((p/len(data))*math.log2(p/len(data)) for p in [data.count(b) for b in set(data)]); print(f\'Entropy: {ent:.4f} / 8.0000\')"',
    expectedOutput: 'Entropy: 7.9842 / 8.0000\n[ANOMALY DETECTED]: Critical High-Entropy Stream (> 7.85). Suspected Ransomware or Encrypted Exfiltration.',
    verificationRule: 'Shannon Entropy H >= 7.85 triggers automated SDN containment in < 300ms.',
    explanationAr: 'البيانات العادية (مثل HTML أو نصوص JSON) تتسم بإنتروبيا بين 3.5 و 5.2. أما الملفات المشفرة فتتجاوز 7.85 مما يفضح نشاط برمجيات الفدية لحظياً.',
    explanationEn: 'Plaintext JSON or source code hovers around H=4.0; encrypted ransomware payloads manifest near-maximum entropy (H>7.85), proving automated containment.'
  },
  {
    id: 'lab_crt_subdomains',
    titleAr: 'استخراج النطاقات الفرعية والأصول المهملة من سجلات Certificate Transparency',
    titleEn: 'Passive Subdomain Enumeration via Certificate Transparency Logs',
    categoryAr: 'الاستطلاع السيبراني وOSINT',
    categoryEn: 'OSINT & Reconnaissance',
    difficulty: 'متوسط',
    descriptionAr: 'جمع جميع النطاقات الفرعية التابعة للمؤسسة بالاعتماد على سجلات شهادات TLS العامة المفتوحة دون توجيه حزمة فحص واحدة للهدف.',
    descriptionEn: 'Gathers all corporate subdomains and shadow assets passively from global certificate transparency logs without transmitting a single probe.',
    command: 'curl -s "https://crt.sh/?q=%.domain.ma&output=json" | jq -r ".[].name_value" | sort -u | head -n 8',
    expectedOutput: 'api.domain.ma\nauth-stage.domain.ma\nbanking-portal.domain.ma\ndb-admin-internal.domain.ma\nvpn.domain.ma',
    verificationRule: 'Zero packets sent to target. Compliant with Moroccan Penal Code Law 07-03.',
    explanationAr: 'عند إصدار أي شهادة HTTPS للموقع، تُسجل الشهادة إجبارياً في سجلات عامة لا يمكن التلاعب بها. الاستعلام منها يتيح اكتشاف الخوادم الداخلية المهملة بأمان.',
    explanationEn: 'Public Certificate Transparency mirrors index all issued TLS certs globally, enabling total footprint mapping without alerting firewalls.'
  },
  {
    id: 'lab_suid_privesc',
    titleAr: 'فحص ملفات SUID الخطرة ومنع كسر الامتيازات (Privilege Escalation)',
    titleEn: 'Audit Dangerous SUID Binaries to Thwart Local Privilege Escalation',
    categoryAr: 'أمن أنظمة لينكس والنواة',
    categoryEn: 'Linux Kernel & System Security',
    difficulty: 'متوسط',
    descriptionAr: 'مسح كافة الملفات التنفيذية التي تحمل علامة SUID (setuid) في نظام الملفات والتحقق من عدم إمكانية استغلالها للحصول على صلاحيات root.',
    descriptionEn: 'Scans the root filesystem for binaries configured with the SUID bit, ensuring zero misconfigured interpreters permit local root takeover.',
    command: 'find / -perm -4000 -type f -exec ls -ld {} \\; 2>/dev/null | grep -E "bash|sh|python|perl|find|vim"',
    expectedOutput: '[AUDIT SCAN]: Scanning SUID binaries across all mount points...\n[CLEAN]: Zero dangerous interpreter binaries found with SUID permissions.\n[POLICY]: Strict CIS Benchmark Level 2 Enforced.',
    verificationRule: 'No shell or scripting language may bear SUID bits in hardened deployments.',
    explanationAr: 'إذا حمل ملف مثل /usr/bin/python أو /usr/bin/find علامة SUID، يمكن لأي مستخدم عادي استدعاء شيل بصلاحيات root بضغطة زر. يجب تجريد هذه العلامة فوراً.',
    explanationEn: 'SUID on scripting interpreters allows trivial root breakout. CIS guidelines mandate revoking 4000 permission bits from all non-system binaries.'
  },
  {
    id: 'lab_sqli_prepared',
    titleAr: 'تحصين قواعد البيانات باستعلام مجهز مسبقاً (Parameterized Query)',
    titleEn: 'Harden Database Engine with Parameterized Prepared Statements',
    categoryAr: 'أمن تطبيقات الويب وقواعد البيانات',
    categoryEn: 'Web App & Database Security',
    difficulty: 'متوسط',
    descriptionAr: 'إعداد استعلام مصادقة مجهز مسبقاً يفصل كود الاستعلام النحوي عن مدخلات المستخدم، مما يجعل هجمات حقن SQL مستحيلة رياضياً.',
    descriptionEn: 'Creates a compiled SQL prepared statement decoupling grammar logic from client parameters, mathematically rendering SQL injection impossible.',
    command: 'psql -U sovereign -d defense_db -c "PREPARE auth_check(text, text) AS SELECT id, role FROM operators WHERE username = $1 AND auth_token = $2;"',
    expectedOutput: 'PREPARE\n[STATUS]: Prepared Statement auth_check registered in PostgreSQL engine.\n[PROOF]: Raw string concatenation eradicated. SQLi payload rendered inert text.',
    verificationRule: 'All database calls must use parameter substitution ($1, $2) exclusively.',
    explanationAr: 'بإعداد الاستعلام مسبقاً، يتعامل المحرك مع المعامل $1 كنص خام فقط، حتى لو كتب المهاجم \' OR \'1\'=\'1 لن تتغير شجرة تنفيذ الاستعلام إطلاقاً.',
    explanationEn: 'The AST compiles once; user parameters are injected into literal slots without modifying execution branches or authorization gates.'
  },
  {
    id: 'lab_rootless_container',
    titleAr: 'تشغيل حاوية معزولة بدون امتيازات النواة (Rootless Hardened Pod)',
    titleEn: 'Launch Rootless Container with Full Linux Capability Stripping',
    categoryAr: 'أمن السحابة والحاويات Kubernetes',
    categoryEn: 'Cloud & Container Security',
    difficulty: 'متقدم',
    descriptionAr: 'تشغيل حاوية خفيفة مع إسقاط جميع قدرات لينكس (Drop All Capabilities) وفرض نظام ملفات للقراءة فقط لمنع أي برمجيات خبيثة من التثبيت.',
    descriptionEn: 'Spawns an isolated container dropping all Linux capabilities, enforcing read-only root filesystems, and denying privilege escalation flags.',
    command: 'docker run --rm --read-only --cap-drop=ALL --security-opt=no-new-privileges:true --user 10001:10001 alpine:latest whoami',
    expectedOutput: 'uid=10001(nonroot) gid=10001(nonroot)\n[CONTAINER AUDIT]: CapDrop=ALL applied.\n[CONTAINER AUDIT]: ReadOnlyRootFS=TRUE enforced.\n[ESCAPE RESISTANCE]: Host Kernel Completely Isolated.',
    verificationRule: 'Container breakout impossible even with arbitrary code execution inside pod.',
    explanationAr: 'تجريد الحاوية من CAP_SYS_ADMIN و CAP_NET_ADMIN يمنعها من لمس أجهزة الخادم الحقيقي، ونظام الملفات غير القابل للكتابة يمنع تنزيل أي أدوات اختراق.',
    explanationEn: 'Dropping all capabilities denies access to raw sockets and host mounts, eliminating 100% of standard container breakout CVE exploit vectors.'
  },
  {
    id: 'lab_pqc_hkdf',
    titleAr: 'توليد بذور مفاتيح ما بعد الكم بمعيار NIST FIPS 203 (ML-KEM)',
    titleEn: 'Derive Quantum-Resistant Key Seeds via NIST FIPS 203 Lattice HKDF',
    categoryAr: 'التشفير المقاوم للكم PQC',
    categoryEn: 'Post-Quantum Cryptography',
    difficulty: 'خبير سيادي',
    descriptionAr: 'توليد مفاتيح تشفير شبكية مقاومة للحواسيب الكمومية بالاعتماد على خوارزمية مشتقة من بذور إنتروبيا عشوائية حقيقية محصنة ضد خوارزمية شور.',
    descriptionEn: 'Generates quantum-immune cryptographic key material using lattice derivation functions verified against NIST FIPS 203 standards.',
    command: 'openssl kdf -keylen 32 -kdfopt pass:sovereign_lattice_entropy -kdfopt salt:morocco_national_seed HKDF',
    expectedOutput: 'e8:a4:21:f9:83:0b:61:52:9a:77:4d:1c:ee:34:bb:91:0a:fe:32:89:14:66:bc:88:51:29:f3:10:aa:98:40:71\n[POST-QUANTUM SEED]: 256-bit Lattice Derived Key Ready.\n[RESILIENCE]: Immune to Shor\'s and Grover\'s Quantum Algorithms.',
    verificationRule: 'Guarantees retrospective immunity against Harvest-Now-Decrypt-Later threats.',
    explanationAr: 'الاعتماد على مشاكل الشبكات الرياضية كثيرة الأبعاد (Lattice Cryptography) يجعل كسر التشفير مستحيلاً حتى لو امتلك الخصم حاسوباً كمومياً بمليون كيوبت.',
    explanationEn: 'Lattice-based key exchange requires solving shortest vector problems in high dimensions, which Shor quantum factorization algorithms cannot solve.'
  },
  {
    id: 'lab_dfir_memory',
    titleAr: 'سحب صورة جنائية للذاكرة الحية (RAM) وعزل الخادم المشبوه',
    titleEn: 'Acquire Forensically Sound Volatile RAM Dump & Sever Egress',
    categoryAr: 'التحقيق الجنائي الرقمي والسيادة DFIR & DGSSI',
    categoryEn: 'Digital Forensics & Incident Response',
    difficulty: 'متقدم',
    descriptionAr: 'التقاط صورة كاملة لذاكرة RAM المتطايرة عبر أداة LiME لحفظ الأدلة الجنائية، ثم عزل حركة مرور الخادم فوراً لمنع تسريب البيانات.',
    descriptionEn: 'Dumps live volatile RAM via kernel acquisition module to preserve process state, followed by immediate network micro-segmentation.',
    command: 'sudo lime-dump --output /mnt/forensics/case_001_ram.raw --format raw && iptables -I INPUT -j DROP && iptables -I OUTPUT -j DROP',
    expectedOutput: '[LIME]: Physical memory acquisition complete (16,384 MB written, SHA256 verified).\n[ISOLATION]: Local network sockets severed via kernel netfilter.\n[CHAIN OF CUSTODY]: Evidence sealed with immutable Merkle hash.',
    verificationRule: 'Volatile RAM preserved intact prior to any host power interruption.',
    explanationAr: 'الذاكرة الحية تحتوي على مفاتيح التشفير المستخدمة وبرمجيات التسلل التي لم تُكتب على القرص. عزل الشبكة يمنع المهاجم من مسح آثاره عن بعد.',
    explanationEn: 'Fileless malware and in-memory encryption keys vanish upon reboot; LiME raw dumping captures forensic proof before cutting attacker control channels.'
  }
];

export const SOVEREIGN_GLOSSARY: GlossaryItem[] = [
  {
    id: 'term_ebpf',
    termAr: 'مرشح الحزم الموسع في النواة',
    termEn: 'Extended Berkeley Packet Filter',
    acronym: 'eBPF',
    categoryAr: 'هندسة النواة والدفاع السلكي',
    categoryEn: 'Kernel Architecture',
    definitionAr: 'تقنية ثورية في نواة لينكس تتيح تشغيل برامج مصغرة معتمدة وآمنة داخل النواة مباشرة دون تعديل كود النواة أو تحميل وحدات خارجية غير موثوقة.',
    definitionEn: 'A revolutionary Linux kernel technology enabling verified sandboxed programs to execute directly within the kernel without recompilation or kernel module risks.',
    importanceAr: 'تمكّن المنظومة من رصد الحزم وإسقاط الهجمات في النواة في زمن استجابة أقل من 300 ميلي ثانية.',
    importanceEn: 'Enables sub-millisecond wire-speed packet inspection and autonomous threat mitigation without user-space overhead.',
    standard: 'Linux Kernel Documentation BPF / RFC 9669'
  },
  {
    id: 'term_xdp',
    termAr: 'مسار البيانات فائق السرعة',
    termEn: 'eXpress Data Path',
    acronym: 'XDP',
    categoryAr: 'هندسة النواة والدفاع السلكي',
    categoryEn: 'Kernel Architecture',
    definitionAr: 'طبقة معالجة برمجية فائقة الأداء في بطاقة الشبكة تنفذ برامج eBPF بمجرد وصول الحزم لحلقة الاستقبال (Ring Buffer) قبل مكدس الشبكة.',
    definitionEn: 'An ultra-high performance data path executing eBPF programs on the network device driver layer before kernel socket buffer allocation.',
    importanceAr: 'القدرة على إسقاط ما يصل إلى 40 مليون حزمة هجوم في الثانية الواحدة لكل نواة معالج.',
    importanceEn: 'Enables wire-speed dropping of volumetric DDoS attacks exceeding 40 million packets per second per CPU core.',
    standard: 'Linux Networking Subsystem'
  },
  {
    id: 'term_pqc',
    termAr: 'تشفير ما بعد الحوسبة الكمومية',
    termEn: 'Post-Quantum Cryptography',
    acronym: 'PQC',
    categoryAr: 'التشفير وحماية البيانات',
    categoryEn: 'Cryptography',
    definitionAr: 'جيل جديد من خوارزميات التشفير الرياضية المصممة لتكون منيعة ضد كل من الحواسيب التقليدية والحواسيب الكمومية المستقبلية وخوارزمية شور.',
    definitionEn: 'Cryptographic algorithms formulated on hard mathematical problems that are secure against both classical and cryptanalytically relevant quantum computers.',
    importanceAr: 'إحباط هجمات "احصد الآن واكسر لاحقاً" وحماية أسرار الدولة والبيانات المصرفية لعقود قادمة.',
    importanceEn: 'Neutralizes "Harvest Now, Decrypt Later" espionage, ensuring sovereign secrets remain secure for decades.',
    standard: 'NIST FIPS 203 (ML-KEM) / FIPS 204 (ML-DSA)'
  },
  {
    id: 'term_shannon',
    termAr: 'إنتروبيا شانون لقياس عشوائية البيانات',
    termEn: 'Shannon Information Entropy',
    acronym: 'H(X)',
    categoryAr: 'الرياضيات وكشف الشذوذ',
    categoryEn: 'Mathematics & Anomaly Detection',
    definitionAr: 'مقياس رياضي يحسب درجة الفوضى وتوزيع احتمالات البايتات داخل كتلة البيانات، وتتراوح قيمته بين 0.0 و 8.0 بت لكل بايت.',
    definitionEn: 'A mathematical measure of uncertainty and byte distribution randomness within a data stream, ranging from 0.0 to 8.0 bits per byte.',
    importanceAr: 'كشف برمجيات الفدية وقنوات تسريب البيانات المشفرة سراً لأنها تنتج إنتروبيا تقارب 8.0 دون الحاجة لتواقيع مسبقة.',
    importanceEn: 'Unmasks zero-day ransomware tunnels and covert data exfiltration by detecting anomalous high-entropy signatures (H > 7.85).',
    standard: 'Claude Shannon Information Theory (1948)'
  },
  {
    id: 'term_zero_trust',
    termAr: 'معمارية انعدام الثقة',
    termEn: 'Zero Trust Architecture',
    acronym: 'ZTA',
    categoryAr: 'المعمارية والسيادة',
    categoryEn: 'Architecture',
    definitionAr: 'نموذج أمني يفرض مبدأ «لا تثق بأي طرف أبداً، وتحقق منه في كل لحظة»، ملغياً الثقة التلقائية حتى داخل مقاطع الشبكة الداخلية للمؤسسة.',
    definitionEn: 'A cybersecurity paradigm founded on "Never Trust, Always Verify", eliminating implicit trust for any user, device, or network conduit.',
    importanceAr: 'يمنع المهاجم من التمدد العرضي (Lateral Movement) داخل مراكز البيانات عند اختراق أي خادم أو جهاز طرفي.',
    importanceEn: 'Thwarts lateral movement across internal datacenters by continuously micro-segmenting and authenticating every single transaction.',
    standard: 'NIST Special Publication 800-207'
  },
  {
    id: 'term_merkle',
    termAr: 'شجرة ميركل المشفرة',
    termEn: 'Cryptographic Merkle Tree',
    acronym: 'Merkle Tree',
    categoryAr: 'التشفير والنزاهة الجنائية',
    categoryEn: 'Integrity & Forensics',
    definitionAr: 'بنية بيانات شجرية تُربط فيها كل عقدة ورقية ببصمة تجزئة السجل، وتُدمج كل عقدتين لتوليد جذر تشفيري واحد (Root Hash) غير قابل للتلاعب.',
    definitionEn: 'A cryptographic tree data structure where leaf nodes hold cryptographic hashes of data records, culminating in a single tamper-evident root hash.',
    importanceAr: 'تقديم دليل رياضي قاطع أمام المحاكم والجهات التنظيمية بأن سجلات الحوادث لم يتم تعديلها أو مسحها من قبل المهاجمين.',
    importanceEn: 'Provides immutable mathematical proof that incident logs have not been altered or purged by an intruder following compromise.',
    standard: 'RFC 6962 Certificate Transparency / ISO 27001'
  },
  {
    id: 'term_dgssi',
    termAr: 'المديرية العامة لأمن نظم المعلومات',
    termEn: 'General Directorate of Information Systems Security (Morocco)',
    acronym: 'DGSSI',
    categoryAr: 'التشريعات والسيادة الوطنية',
    categoryEn: 'National Sovereignty',
    definitionAr: 'السلطة الوطنية بالمملكة المغربية المسؤولة عن بلورة وتنفيذ الاستراتيجية الوطنية للأمن السيبراني وحماية البنى التحتية الحيوية.',
    definitionEn: 'The supreme national cybersecurity agency of the Kingdom of Morocco responsible for formulating and enforcing national cyber defense directives.',
    importanceAr: 'المرجع الرسمي والملزم لكافة المعايير والسياسات الأمنية لحماية السيادة الرقمية المغربية.',
    importanceEn: 'The authoritative regulatory body establishing mandatory protection standards for all critical Moroccan infrastructure.',
    standard: 'Moroccan Law 05-20 / Directive Nationale de la Sécurité des Systèmes d\'Information (DNSSI)'
  },
  {
    id: 'term_cndp',
    termAr: 'اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي',
    termEn: 'National Commission for Personal Data Protection (Morocco)',
    acronym: 'CNDP',
    categoryAr: 'التشريعات والسيادة الوطنية',
    categoryEn: 'National Sovereignty',
    definitionAr: 'الهيئة المغربية المستقلة المعنية بمراقبة احترام القانون 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.',
    definitionEn: 'The independent Moroccan authority overseeing compliance with Law 09-08 governing the protection of individuals with regard to personal data processing.',
    importanceAr: 'تضمن عدم تسريب أو تخزين أو معالجة بيانات المواطنين والموظفين بدون تصريح مسبق وتدابير حماية صارمة.',
    importanceEn: 'Enforces strict data sovereignty, confidentiality, and legal compliance across public and private Moroccan institutions.',
    standard: 'Moroccan Law 09-08 / European GDPR Alignment'
  }
];

export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    id: 'LEVEL_00',
    levelBadge: 'LEVEL 00',
    levelAr: 'المستوى 00: البداية من الصفر والعقلية الدفاعية',
    levelEn: 'Level 00: Ground Zero & Ethical Mindset',
    titleAr: 'عقلية الهاكر الأخلاقي، النظافة السيبرانية، والأطر التشريعية',
    titleEn: 'Ethical Hacker Mindset, Cyber Hygiene & National Frameworks',
    descAr: 'الفرق بين القبعة البيضاء والسوداء، قوانين الأمن السيبراني بالمغرب، كيفية حماية الهوية الرقمية، وإتقان المبادئ الدفاعية الأولى.',
    descEn: 'White Hat vs Black Hat, Moroccan cybersecurity statutes, establishing digital sovereignty, and personal operational security.',
    duration: '45 دقيقة',
    estimatedHours: 2,
    prerequisitesAr: 'لا توجد شروط مسبقة. متاح لكل شغوف بحماية الوطن والمؤسسات.',
    prerequisitesEn: 'Zero prerequisites. Designed for aspiring defenders and engineers.',
    topicsAr: [
      {
        title: 'ما هو الاختراق الأخلاقي (White Hat Hacking)؟',
        detail: 'الاختراق الأخلاقي هو تسخير نفس أدوات ومهارات المهاجمين ولكن بتفويض رسمي وقانوني مكتوب، بهدف اكتشاف الثغرات وتنبيه المؤسسات وسدها قبل أن يستغلها مجرمو الإنترنت.',
        tips: 'القاعدة الذهبية الصارمة: لا تختبر أي نظام أو شبكة دون تصريح كتابي رسمي وموثق مسبقاً.'
      },
      {
        title: 'الهندسة الاجتماعية والتصيد الاحتيالي (Phishing Defense)',
        detail: 'أكثر من 85% من الاختراقات في العالم تبدأ بخداع العنصر البشري عبر رسائل بريد أو واتساب مزيفة تحمل روابط ملغومة أو تطلب كلمات السر.',
        command: 'whois target-domain.ma',
        tips: 'تحقق دائماً من اسم النطاق، وفعل المصادقة الثنائية (2FA) عبر تطبيقات TOTP مثل Google Authenticator بدلاً من رسائل SMS.'
      },
      {
        title: 'التشريعات الوطنية وحماية المعطيات بالمغرب (CNDP / DGSSI)',
        detail: 'في المغرب، القانون 07-03 المتمم للقانون الجنائي يجرم الدخول غير المصرح به للأنظمة المعلوماتية، والمنظومات الوطنية تخضع لتوجيهات المديرية العامة لأمن نظم المعلومات (DGSSI).',
        tips: 'الالتزام الأخلاقي والقانوني الصارم هو ما يميز الخبير السيبراني المحترف عن المخترق غير القانوني.'
      }
    ],
    topicsEn: [
      {
        title: 'What is Ethical Hacking (White Hat)?',
        detail: 'Ethical hacking utilizes attacker toolsets with explicit written authorization to identify weaknesses and patch vulnerabilities before adversaries exploit them.',
        tips: 'Golden Rule: Never probe or scan any infrastructure without signed written permission.'
      },
      {
        title: 'Social Engineering & Spear Phishing',
        detail: 'Over 85% of breaches start with deceiving human operators through forged links or decoy emails.',
        command: 'whois target-domain.ma',
        tips: 'Always inspect canonical domain names and mandate Hardware or TOTP 2FA.'
      },
      {
        title: 'Legal Directives & Data Privacy (CNDP / DGSSI)',
        detail: 'Strict compliance with Moroccan laws (07-03, 09-08) and DGSSI directives distinguishes an ethical professional from unauthorized threat actors.',
        tips: 'Professional credentials and legal ethics safeguard your career.'
      }
    ],
    quizzes: [
      COMPREHENSIVE_QA_BANK[0],
      COMPREHENSIVE_QA_BANK[1],
      COMPREHENSIVE_QA_BANK[2]
    ]
  },
  {
    id: 'LEVEL_01',
    levelBadge: 'LEVEL 01',
    levelAr: 'المستوى 01: الأساسيات الصلبة للينكس والشبكات',
    levelEn: 'Level 01: Linux Administration & Network Packets',
    titleAr: 'إدارة خوادم لينكس، بروتوكولات TCP/IP، وتحليل حزم البيانات',
    titleEn: 'Linux Administration, TCP/IP Stack & Deep Packet Analysis',
    descAr: 'كيف تنتقل حزم البيانات عبر الإنترنت، فهم بروتوكولات TCP/UDP والمنافذ، أسرار سطر الأوامر الطرفي (CLI)، وفحص حركة المرور بلاقط الحزم.',
    descEn: 'Packet routing mechanics, TCP/UDP handshakes, socket architecture, CLI fluency, and sniffing unencrypted transit flows.',
    duration: '1 ساعة و 15 دقيقة',
    estimatedHours: 4,
    prerequisitesAr: 'معرفة أساسية بمبادئ الحاسوب ونظام الملفات.',
    prerequisitesEn: 'Basic familiarity with computer operating systems.',
    topicsAr: [
      {
        title: 'نموذج TCP/IP والمنافذ (Ports) المستمعة',
        detail: 'كل خدمة على الخادم تعمل على منفذ محدد (Port). مثلاً المنفذ 80 للـ HTTP، و443 للـ HTTPS المشفر، و22 للـ SSH، و53 للـ DNS.',
        command: 'ss -tulpn | grep LISTEN',
        tips: 'أول خطوة في تدقيق أي سيرفر هي معرفة المنافذ المفتوحة والخدمات المستمعة خلفها عبر النواة.'
      },
      {
        title: 'أوامر لينكس الأساسية لكل مهندس أمن سيبراني',
        detail: 'سطر الأوامر هو بيئة عمل المهندس الدفاعي: فحص العمليات، التحكم في الصلاحيات (chmod / chown)، وأدوات الترشيح المتقدمة (grep, awk, curl).',
        command: 'uname -a && cat /etc/passwd | cut -d: -f1',
        tips: 'احرص على إتقان صلاحيات الملفات وتجنب منح أذونات 777 لأي ملف أو مجلد نهائياً.'
      },
      {
        title: 'تحليل الحزم والتقاط الاتصالات بـ Tcpdump و Wireshark',
        detail: 'البيانات غير المشفرة (Plaintext) يمكن لأي جهاز على نفس مقطع الشبكة قراءتها بمجرد تشغيل لاقط الحزم في الوضع الشامل (Promiscuous Mode).',
        command: 'sudo tcpdump -i eth0 -nn -c 10 port 80',
        tips: 'هذا يوضح لك لماذا نصر في ميثاق طه الستري على التشفير الشامل وفرض بروتوكول TLS 1.3.'
      }
    ],
    topicsEn: [
      {
        title: 'TCP/IP Model & Standard Network Ports',
        detail: 'Services listen on defined sockets: Port 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS). Understanding sockets is fundamental.',
        command: 'ss -tulpn | grep LISTEN',
        tips: 'Identifying open ports is the first step of any attack surface evaluation.'
      },
      {
        title: 'Crucial Linux CLI Commands',
        detail: 'The command line is the terminal home of ethical engineers: process inspects, pipes, grep, awk, and file privileges.',
        command: 'uname -a && cat /etc/passwd | cut -d: -f1',
        tips: 'Master file permission bits (chmod / chown) and process tracing.'
      },
      {
        title: 'Packet Sniffing with Tcpdump & Wireshark',
        detail: 'Unencrypted plaintext traffic exposes credentials on local transit segments.',
        command: 'sudo tcpdump -i eth0 -nn -c 10 port 80',
        tips: 'Demonstrates why sovereign encryption and kernel inspection are indispensable.'
      }
    ],
    quizzes: [
      COMPREHENSIVE_QA_BANK[3],
      COMPREHENSIVE_QA_BANK[4],
      COMPREHENSIVE_QA_BANK[5]
    ]
  },
  {
    id: 'LEVEL_02',
    levelBadge: 'LEVEL 02',
    levelAr: 'المستوى 02: الاستطلاع المتقدم وفحص الثغرات',
    levelEn: 'Level 02: Reconnaissance & Vulnerability Discovery',
    titleAr: 'استطلاع الأهداف، مسح الشبكات بـ Nmap، وتشريح ثغرات OWASP Top 10',
    titleEn: 'Target Surface Mapping, Stealth Nmap Scans & OWASP Top 10 Analysis',
    descAr: 'كيف تكتشف ما هي الخوادم التابعة للهدف، وفحص المنافذ بـ Nmap دون كشفك، والوقاية من ثغرات حقن SQL، والـ XSS، وكسر الجلسات.',
    descEn: 'Passive/active surface enumeration, stealth half-open SYN mapping, and defeating critical web flaws including SQLi and XSS.',
    duration: '1 ساعة و 45 دقيقة',
    estimatedHours: 6,
    prerequisitesAr: 'إكمال المستوى 01 وفهم مقابس الشبكة وأوامر لينكس.',
    prerequisitesEn: 'Completion of Level 01 and understanding of TCP sockets.',
    topicsAr: [
      {
        title: 'جمع المعلومات والاستطلاع السلبي السري (OSINT)',
        detail: 'قبل فحص أي هدف، يتم جمع المعلومات المتاحة علناً: النطاقات الفرعية، سجلات DNS، شهادات التشفير، والبريد الإلكتروني المسرب دون إرسال بايت واحد للهدف.',
        command: 'dig target-domain.ma ANY +noall +answer',
        tips: 'استخدام محركات بحث الأجهزة المتصلة مثل Shodan و Censys للكشف عن الخوادم والأجهزة المهملة بأمان.'
      },
      {
        title: 'فحص الشبكات والمنافذ المتقدم بأداة Nmap',
        detail: 'تحديد الخدمات وإصدارات البرمجيات وأنظمة التشغيل التي تعمل على الخادم بدقة متناهية عبر حزم SYN خفية.',
        command: 'nmap -sS -sV -p 22,80,443,8080 196.200.14.88',
        tips: 'فحص SYN Stealth Scan (-sS) يرسل حزمة مزامنة دون إكمال المصافحة الثلاثية لتقليل رصده في سجلات التطبيق.'
      },
      {
        title: 'أشهر ثغرات الويب: حقن قواعد البيانات (SQL Injection) والوقاية منها',
        detail: 'تحدث عندما يقبل التطبيق مدخلات المستخدم مباشرة دون تعقيم ويدمجها في استعلام قاعدة البيانات.',
        command: "' OR '1'='1",
        tips: 'العلاج الهندسي الحاسم والوحيد هو استخدام الاستعلامات المجهزة مسبقاً (Prepared Statements).'
      }
    ],
    topicsEn: [
      {
        title: 'Open Source Intelligence (OSINT)',
        detail: 'Gathering public footprint metadata: DNS records, subdomains, leaked credentials prior to active probing.',
        command: 'dig target-domain.ma ANY +noall +answer',
        tips: 'Leverage IoT indexers like Shodan to find exposed shadow IT assets.'
      },
      {
        title: 'Network & Port Mapping with Nmap',
        detail: 'Detecting service software versions, operating systems, and firewall filtering states.',
        command: 'nmap -sS -sV -p 22,80,443,8080 196.200.14.88',
        tips: 'SYN scan (-sS) initiates half-open handshakes to probe port states.'
      },
      {
        title: 'Top Web Weaknesses: SQL Injection (SQLi)',
        detail: 'Occurs when unfiltered client parameters are concatenated directly into raw database query strings.',
        command: "' OR '1'='1",
        tips: 'Remediation: Always use parameterized prepared statements, never raw string concatenation.'
      }
    ],
    quizzes: [
      COMPREHENSIVE_QA_BANK[6],
      COMPREHENSIVE_QA_BANK[7],
      COMPREHENSIVE_QA_BANK[8]
    ]
  },
  {
    id: 'LEVEL_03',
    levelBadge: 'LEVEL 03',
    levelAr: 'المستوى 03: الدفاع الذاتي السيادي وهندسة النواة',
    levelEn: 'Level 03: Sovereign Blue Teaming & Kernel Engineering',
    titleAr: 'الاعتراض السلكي ببرمجة eBPF/XDP، كشف الشذوذ الرياضي، وتشفير ما بعد الكم',
    titleEn: 'Wire-Speed eBPF/XDP Defense, Shannon Entropy & NIST Post-Quantum Cryptography',
    descAr: 'كيف تبني منظومة دفاع ذكية مثل منظومة طه الستري لتحييد الهجمات في النواة في أقل من 300ms ومقاومة حواسيب الكم بمعايير FIPS 203.',
    descEn: 'Sub-300ms kernel mitigation via eBPF/XDP drivers, statistical entropy anomaly detection, and NIST Post-Quantum lattice algorithms.',
    duration: '2 ساعة',
    estimatedHours: 8,
    prerequisitesAr: 'إكمال المستوى 02 وفهم عميق للشبكات ومفاهيم التشفير.',
    prerequisitesEn: 'Completion of Level 02 and solid grounding in cryptographic math.',
    topicsAr: [
      {
        title: 'الاعتراض في كابل الشبكة ببرمجة eBPF / XDP',
        detail: 'بدلاً من انتظار وصول الحزمة إلى نظام التشغيل والبرامج، يقوم مسبر XDP بفحص الحزمة وإسقاطها فور وصولها لبطاقة الشبكة (NIC) مباشرة.',
        command: 'bpftool prog list',
        tips: 'هذا يقلل زمن التحييد من ثوانٍ إلى أجزاء من الميلي ثانية (Sub-second Wire-speed).'
      },
      {
        title: 'كشف الهجمات المجهولة بالرياضيات (Shannon Entropy)',
        detail: 'هجمات الفدية وتسريب البيانات تتسم بدرجة عشوائية وفوضى بيانات (Entropy) غير طبيعية تقترب من 8.0 مقارنة بالحزم العادية.',
        command: 'H(X) = - sum(P(x) * log2(P(x)))',
        tips: 'المنظومة ترصد هجمات يوم الصفر (Zero-Days) بدون الحاجة لأي توقيع مسبق.'
      },
      {
        title: 'تشفير ما بعد الكم (Post-Quantum Cryptography)',
        detail: 'خوارزميات التشفير التقليدية (مثل RSA) ستسقط أمام الحواسيب الكمومية. لذلك دمجنا خوارزمية ML-KEM-1024 المعيارية من NIST لحماية أسرار الوطن والشركات.',
        tips: 'السيادة الحقيقية تبدأ من حماية بيانات اليوم ضد حواسيب الغد.'
      }
    ],
    topicsEn: [
      {
        title: 'Wire-Speed Kernel Interception with eBPF / XDP',
        detail: 'Dropping hostile traffic at the network driver layer before kernel socket allocations.',
        command: 'bpftool prog list',
        tips: 'Reduces mitigation latency from seconds to sub-millisecond wire-speed.'
      },
      {
        title: 'Signature-Free Anomaly via Shannon Entropy',
        detail: 'Exfiltration and encrypted ransomware tunnels manifest elevated mathematical entropy compared to benign baselines.',
        command: 'H(X) = - sum(P(x) * log2(P(x)))',
        tips: 'Detects zero-day threats mathematically without waiting for signature databases.'
      },
      {
        title: 'Post-Quantum Cryptography (NIST FIPS 203)',
        detail: 'Lattice-based algorithms (ML-KEM-1024) ensure encrypted data remains unbreakable by future quantum computers.',
        tips: 'Harvest-now-decrypt-later attacks are neutralized.'
      }
    ],
    quizzes: [
      COMPREHENSIVE_QA_BANK[9],
      COMPREHENSIVE_QA_BANK[10],
      COMPREHENSIVE_QA_BANK[11]
    ]
  },
  {
    id: 'LEVEL_04',
    levelBadge: 'LEVEL 04',
    levelAr: 'المستوى 04: الاستجابة للحوادث والتحقيق الجنائي الرقمي (DFIR)',
    levelEn: 'Level 04: Incident Response, Digital Forensics & Sovereign Compliance',
    titleAr: 'بروتوكول الـ 15 دقيقة، استخراج أدلة الذاكرة LiME، وسلاسل ميركل المحصنة',
    titleEn: '15-Minute Containment Protocol, Volatile RAM Forensics & Tamper-Proof Merkle Ledgers',
    descAr: 'كيف تعزل الخوادم المصابة في دقائق دون مسح الذاكرة الحية، تحليل البرمجيات الخبيثة غير المكتوبة على القرص، وسجلات ميركل القانونية.',
    descEn: 'Rapid micro-segmentation, extracting volatile RAM state via LiME, fileless malware dissection, and immutable Merkle audit proofs.',
    duration: '2 ساعة و 15 دقيقة',
    estimatedHours: 8,
    prerequisitesAr: 'إكمال المستوى 03 وفهم معمارية النواة.',
    prerequisitesEn: 'Completion of Level 03 and kernel memory models.',
    topicsAr: [
      {
        title: 'قاعدة الـ 15 دقيقة لعزل التهديد (Rapid Containment)',
        detail: 'عند اكتشاف اختراق، يمنع إعادة تشغيل الجهاز نهائياً لأن ذلك يحذف أدلة الذاكرة الحية RAM. يتم عزل حركة المرور فوراً عبر iptables/XDP مع الإبقاء على تشغيل الجهاز.',
        command: 'iptables -I INPUT -j DROP && iptables -I OUTPUT -j DROP',
        tips: 'السرعة في الربع ساعة الأولى تحول الحادث من كارثة وطنية إلى محاولة محبطة تم توثيقها.'
      },
      {
        title: 'التحقيق الجنائي في الذاكرة الحية (RAM Forensics with LiME)',
        detail: 'استخراج صورة كاملة للذاكرة المتطايرة والبحث عن مفاتيح فك التشفير، وأوامر المهاجم، والعمليات المحقونة في الذاكرة باستخدام أدوات مثل LiME و Volatility.',
        command: 'sudo lime-dump --output /mnt/evidence.raw --format raw',
        tips: 'الحفاظ على سلسلة الحيازة الجنائية (Chain of Custody) لحماية الأدلة أمام المحاكم.'
      },
      {
        title: 'سجلات التدقيق المشفرة بشجرة ميركل (Merkle Tree Integrity)',
        detail: 'تجميع كل أحداث وسجلات النظام وربطها بجذر تشفيري واحد. أي محاولة من المهاجم لمسح أو تعديل سطر قديم ستغير الجذر ويفضح التلاعب فوراً.',
        tips: 'الامتثال الكامل لتوجيهات المديرية العامة لأمن نظم المعلومات (DGSSI) بالمملكة المغربية.'
      }
    ],
    topicsEn: [
      {
        title: 'The 15-Minute Rapid Containment Protocol',
        detail: 'Never reboot an active incident host. Micro-segment the infected node immediately while keeping power on to preserve volatile memory evidence.',
        command: 'iptables -I INPUT -j DROP && iptables -I OUTPUT -j DROP',
        tips: 'First 15 minutes dictate whether an incident is contained or becomes an enterprise catastrophe.'
      },
      {
        title: 'Volatile RAM Forensics with LiME & Volatility',
        detail: 'Dumping volatile physical memory to recover in-memory encryption keys, injection threads, and covert network socket structures.',
        command: 'sudo lime-dump --output /mnt/evidence.raw --format raw',
        tips: 'Strictly adhere to forensic chain-of-custody protocols for legal court admissibility.'
      },
      {
        title: 'Cryptographic Merkle Audit Ledgers',
        detail: 'Hashing audit records into an immutable Merkle root. Any historical record tampering invalidates verification proofs instantly.',
        tips: 'Ensures total compliance with Moroccan DGSSI and international ISO 27001 mandates.'
      }
    ],
    quizzes: [
      COMPREHENSIVE_QA_BANK[12],
      COMPREHENSIVE_QA_BANK[13],
      COMPREHENSIVE_QA_BANK[14]
    ]
  }
];
