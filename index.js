require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const START_CHANNEL = '1550104196085317653';

// Messages
const MESSAGES = {
  intro: '🔎 **الجناح الشرقي المغلق**\n\n' +
    'في سبتمبر 2026، شهدت أكاديمية إيفرمور مجموعة من الحوادث الغريبة، لكن المفاجأة إن أحداثًا مشابهة كانت قد وقعت داخل الأكاديمية قبل 30 سنة، سنة 1996.\n\n' +
    'هل ما يحدث الآن مجرد صدفة؟ أم أن هناك رابطًا بين أحداث الماضي والحاضر؟\n\n' +
    'أمامكم مجموعة من الأدلة والملفات والتسجيلات التي قد تقودكم للحقيقة... لكن عليكم اكتشاف الرابط بأنفسكم.\n\n' +
    'هل أنتم مستعدون لفتح ملف الجناح الشرقي؟\n\n' +
    '**إعداد منزلي جريفندور وهافلباف**\n\n' +
    '💡 **للمتابعة:** اكتب `/reveal` لرؤية العلامة الأولى',
  
  reveal: 'لدينا أول علامة: **2026**.\n\n' +
    '🎥 **الفيديو الأول**\n\n' +
    '📁 مشاهدة الفيديو:\n' +
    'https://drive.google.com/file/d/1Hg7AeSB8x1YmRHSSdFNa4xdHdCDHiMeK/view?usp=sharing\n\n' +
    '📅 **سنة 2026 — ليو يشعر بالدوخة**',
  
  clue2: 'لدينا ثانى علامة : 2026 | رؤية النفس\n\n' +
    '🎥 **الفيديو الثانى**\n\n' +
    '📁 مشاهدة الفيديو:\n' +
    'https://drive.google.com/file/d/1Pr2aWgMdI6-wA8ZCGtgeXE-VkpJZXAjD/view?usp=sharing\n\n' +
    'ميا — إيلينا — جاكوب\n\n' +
    'حادثة رؤية كل منهم لنسخة من نفسه.',
  
  clue3: '╭・**1996 | الجهاز**\n\n' +
    '🎥 **الفيديو الثالث**\n\n' +
    '📁 **شكل الجهاز وصوته — 1996**\n\n' +
    '📁 **مشاهدة الفيديو:**\n' +
    'https://drive.google.com/file/d/1j4BnXGdUzhYxy1OHXZi46f8sKt8J1Mgv/view?usp=sharing\n\n' +
    'شاهدوا الفيديو جيدًا وركزوا على **شكل الجهاز وصوته**، وحاولوا ملاحظة أي تفاصيل قد تساعدكم على فهم ما حدث في عام 1996.\n\n' +
    '**ادرسوا الجهاز جيدًا... قد يظهر مرة أخرى.**',
  
  clue4: '╭・**1996 | التسجيل الأول**\n\n' +
    '🎥 **الفيديو الرابع**\n\n' +
    '**تسجيل الجهاز**\n\n' +
    'تسجيل قصير من داخل **معمل الجناح الشرقي** في أكاديمية إيفرمور، يعود إلى عام **1996**.\n\n' +
    '📁 **مشاهدة الفيديو:**\n' +
    'https://drive.google.com/file/d/19QWRSoAHjcg5kEhCN3sKkXnbY64C_mD_/view?usp=drive_link\n\n' +
    'شاهدوا التسجيل بعناية، وركزوا على ما يظهر في المعمل وما يمكن سماعه خلاله.\n\n' +
    '**كل ثانية من التسجيل قد تحمل دليلًا.**',
  
  clue5: 'وكعادتها، لا تترك جريدة المتنبئ الأخبار الغامضة دون تحقيق، لتكشف هذه المرة عن تفاصيل أكثر إثارة حول ملف الجناح الشرقي داخل الأكاديمية.',
  
  clue6: 'بعد تصاعد آراء الطلاب داخل الأكاديمية، نعود إلى عام 2026 لنشهد مواجهة بين الطالبة فايوليت وبروفيسور أوريون فوس.\n\n' +
    '📁 **مشاهدة الفيديو:**\n' +
    'https://drive.google.com/file/d/1kRSgGPFedZf2J11erZWxPNtOVY3n7cZ-/view?usp=drive_link',
  
  clue7: 'نعود مجددًا إلى عام 1996، حيث تكشف جريدة المتنبئ عن شهادات جديدة حول قضية صوفيا، تفتح أبوابًا جديدة من الشكوك.',
  
  clue8: 'بعد تصاعد الأحداث، تتدخل الوزارة لفتح تحقيق رسمي واستجواب المحقق وليو وإيلينا وجاكوب وميا وأوريون حول ما حدث خلال اليومين الماضيين.',
  
  clue9: 'يواصل قسم التحقيقات مراجعة تفاصيل القضية، ويصدر ملفًا جديدًا يتضمن مراجعة أقوال الطالب ليو وما ورد في التحقيقات الأخيرة.',
  
  clue10: 'نعود إلى عام 1996، حيث تكشف سجلات الأكاديمية عن ملاحظة مهمة تتعلق بمظهر الدكتور المسؤول عن أبحاث الجناح الشرقي.',
  
  clue11: 'نعود إلى عام 2026، حيث يخضع ليو لتحقيق منفرد حول الصوت الذي سمعه داخل الجهاز، في محاولة لكشف هويته وما حدث معه.',
  
  clue12: 'بعد تأكد تورط الدكتور فيكتور، نعود بالزمن إلى عام 1996 لنكشف جانبًا جديدًا من قضية صوفيا:\n\n' +
    'هل اختارت صوفيا خوض التجربة بإرادتها، أم تم خداعها؟ هذا ما ستكشفه جريدة المتنبئ.',
  
  clue13: 'استكمالًا للفيديو الرابع داخل الجناح الشرقي، نعود للحظات التي تلت طلب البروفيسور فيكتور من الطلاب الابتعاد عن الجهاز.\n\n' +
    '**كيف جرت الأمور بعد ذلك؟ هذا ما يكشفه الفيديو السابع والأخير.**\n\n' +
    '📁 **مشاهدة الفيديو:**\n' +
    'https://drive.google.com/file/d/1NjU2PR2KWDDra3aeBuSJzMLZ0_2HxDXV/view?usp=drive_link',
  
  clue14: '**الاستجواب الأخير والمرحلة الأخيرة من القضية.**\n\n' +
    'حان وقت ربط جميع الأحداث والأدلة التي ظهرت خلال التحقيق بما هو قادم، والوصول إلى الحقيقة الكاملة لما حدث في الجناح الشرقي.',
  
  clue15: 'وهنا تنتهي القضية، ويبقى أمامكم **ثلاثة أسئلة فقط** ستقودكم إجاباتها إلى حل لغز الجناح الشرقي.',
  
  question1: '**السؤال الأول:**\n\n' +
    'من اللي ودّى ليو للجناح الشرقي ليلة 9 سبتمبر 2026 وليه؟',
  
  question2: '**السؤال الثاني:**\n\n' +
    'هل فيكتور كان عارف إن صوفيا ما زالت حية؟',
  
  question3: '**السؤال الثالث:**\n\n' +
    'فين صوفيا وإيه اللي حصل لها ليلة 9 سبتمبر 1996؟'
};

// Clue configuration
const CLUES = {
  clue1: { channel: '1549930494089502830', nextChannel: '1549930494089502830' },
  clue2: { channel: '1549930494089502830', nextChannel: '1550115515073036339' },
  clue3: { channel: '1550115515073036339', nextChannel: '1550127552197300265' },
  clue4: { channel: '1550127552197300265', nextChannel: '1550130072881594478' },
  clue5: { channel: '1550130072881594478', nextChannel: '1550287315098804276' },
  clue6: { channel: '1550287315098804276', nextChannel: '1550296033534283866' },
  clue7: { channel: '1550296033534283866', nextChannel: '1550298844602962070' },
  clue8: { channel: '1550298844602962070', nextChannel: '1550301317992415327' },
  clue9: { channel: '1550301317992415327', nextChannel: '1550307871097487360' },
  clue10: { channel: '1550307871097487360', nextChannel: '1550310879592058951' },
  clue11: { channel: '1550310879592058951', nextChannel: '1550312458944782427' },
  clue12: { channel: '1550312458944782427', nextChannel: '1550316279888351322' },
  clue13: { channel: '1550316279888351322', nextChannel: '1550317915834683432' },
  clue14: { channel: '1550317915834683432', nextChannel: '1550319678054862848' },
  clue15: { channel: '1550319678054862848', nextChannel: '1550326750859362304' }
};

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [
  new SlashCommandBuilder().setName('start').setDescription('ابدأ قضية جديدة - Start a new case'),
  new SlashCommandBuilder().setName('reveal').setDescription('اكشف العلامة الأولى - Reveal the first clue'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Commands registered');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

async function postClueButton(channelId, clueNumber, customId, label) {
  try {
    const channel = await client.channels.fetch(channelId);
    const messages = await channel.messages.fetch({ limit: 100 });
    const botMessages = messages.filter(m => m.author.id === client.user.id);
    for (const msg of botMessages.values()) {
      await msg.delete().catch(console.error);
    }
    
    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(ButtonStyle.Success);
    
    const row = new ActionRowBuilder().addComponents(button);
    
    await channel.send({
      content: `🔍 **الدليل ${clueNumber} جاهز!**`,
      components: [row],
    });
    
    console.log(`✅ Posted clue${clueNumber} button`);
  } catch (error) {
    console.error(`Failed to post clue${clueNumber} button:`, error);
  }
}

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await registerCommands();
  
  await postClueButton('1549930494089502830', 2, 'show_clue2', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550115515073036339', 3, 'show_clue3', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550127552197300265', 4, 'show_clue4', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550130072881594478', 5, 'show_clue5', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550287315098804276', 6, 'show_clue6', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550296033534283866', 7, 'show_clue7', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550298844602962070', 8, 'show_clue8', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550301317992415327', 9, 'show_clue9', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550307871097487360', 10, 'show_clue10', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550310879592058951', 11, 'show_clue11', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550312458944782427', 12, 'show_clue12', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550316279888351322', 13, 'show_clue13', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550317915834683432', 14, 'show_clue14', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550319678054862848', 15, 'show_clue15', 'عندما تكون مستعداً حان الوقت لإظهار هذا');
  await postClueButton('1550326750859362304', 'Q1', 'show_question1', 'السؤال الأول');
  
  console.log('🚀 Bot ready!');
});

async function giveRole(interaction, roleName, nextChannelId) {
  const guild = interaction.guild;
  const member = await guild.members.fetch(interaction.user.id);
  const role = guild.roles.cache.find(r => r.name === roleName);
  
  if (!role) {
    await interaction.reply({
      content: `⚠️ لا يمكن العثور على رتبة "${roleName}". يرجى التواصل مع الإدارة.`,
      ephemeral: true,
    });
    return;
  }
  
  if (member.roles.cache.has(role.id)) {
    await interaction.reply({
      content: '✅ لديك هذه الرتبة بالفعل!',
      ephemeral: true,
    });
    return;
  }
  
  await member.roles.add(role);
  await interaction.reply({
    content: `✅ تم منحك رتبة "${roleName}"!\n\n🔍 **الدليل موجود هنا:** <#${nextChannelId}>\n\nتوجه إلى القناة لمتابعة التحقيق!`,
    ephemeral: true,
  });
  console.log(`✅ Gave role "${roleName}" to ${interaction.user.tag}`);
}

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.channelId !== START_CHANNEL) {
        await interaction.reply({
          content: '⚠️ هذا الأمر يعمل فقط في القناة المخصصة.',
          ephemeral: true,
        });
        return;
      }
      
      if (interaction.commandName === 'start') {
        await interaction.reply({ content: MESSAGES.intro, ephemeral: true });
        console.log(`✅ User ${interaction.user.tag} started`);
      }
      
      if (interaction.commandName === 'reveal') {
        const button = new ButtonBuilder()
          .setCustomId('get_clue1_role')
          .setLabel('الذهاب الى ملف القضية')
          .setStyle(ButtonStyle.Primary);
        
        const row = new ActionRowBuilder().addComponents(button);
        
        await interaction.reply({
          content: MESSAGES.reveal,
          components: [row],
          ephemeral: true,
        });
        console.log(`✅ User ${interaction.user.tag} revealed clue`);
      }
    }
    
    if (interaction.isButton()) {
      const buttonActions = {
        get_clue1_role: () => giveRole(interaction, 'clue1', CLUES.clue1.nextChannel),
        show_clue2: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue2_role')
            .setLabel('الذهاب الى ملف القضية الثانى')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue2, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 2`);
        },
        get_clue2_role: () => giveRole(interaction, 'clue2', CLUES.clue2.nextChannel),
        show_clue3: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue3_role')
            .setLabel('الذهاب الى ملف القضية الثالث')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue3, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 3`);
        },
        get_clue3_role: () => giveRole(interaction, 'clue3', CLUES.clue3.nextChannel),
        show_clue4: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue4_role')
            .setLabel('الذهاب الى ملف القضية الرابع')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue4, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 4`);
        },
        get_clue4_role: () => giveRole(interaction, 'clue4', CLUES.clue4.nextChannel),
        show_clue5: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue5_role')
            .setLabel('الذهاب الى ملف القضية الخامس')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue5, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 5`);
        },
        get_clue5_role: () => giveRole(interaction, 'clue5', CLUES.clue5.nextChannel),
        show_clue6: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue6_role')
            .setLabel('الذهاب الى ملف القضية السادس')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue6, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 6`);
        },
        get_clue6_role: () => giveRole(interaction, 'clue6', CLUES.clue6.nextChannel),
        show_clue7: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue7_role')
            .setLabel('الذهاب الى ملف القضية السابع')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue7, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 7`);
        },
        get_clue7_role: () => giveRole(interaction, 'clue7', CLUES.clue7.nextChannel),
        show_clue8: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue8_role')
            .setLabel('الذهاب الى ملف القضية الثامن')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue8, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 8`);
        },
        get_clue8_role: () => giveRole(interaction, 'clue8', CLUES.clue8.nextChannel),
        show_clue9: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue9_role')
            .setLabel('الذهاب الى ملف القضية التاسع')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue9, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 9`);
        },
        get_clue9_role: () => giveRole(interaction, 'clue9', CLUES.clue9.nextChannel),
        show_clue10: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue10_role')
            .setLabel('الذهاب الى ملف القضية العاشر')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue10, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 10`);
        },
        get_clue10_role: () => giveRole(interaction, 'clue10', CLUES.clue10.nextChannel),
        show_clue11: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue11_role')
            .setLabel('الذهاب الى ملف القضية الحادي عشر')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue11, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 11`);
        },
        get_clue11_role: () => giveRole(interaction, 'clue11', CLUES.clue11.nextChannel),
        show_clue12: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue12_role')
            .setLabel('الذهاب الى ملف القضية الثاني عشر')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue12, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 12`);
        },
        get_clue12_role: () => giveRole(interaction, 'clue12', CLUES.clue12.nextChannel),
        show_clue13: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue13_role')
            .setLabel('الذهاب الى ملف القضية الثالث عشر')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue13, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 13`);
        },
        get_clue13_role: () => giveRole(interaction, 'clue13', CLUES.clue13.nextChannel),
        show_clue14: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue14_role')
            .setLabel('الذهاب الى ملف القضية الرابع عشر')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue14, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 14`);
        },
        get_clue14_role: () => giveRole(interaction, 'clue14', CLUES.clue14.nextChannel),
        show_clue15: async () => {
          const button = new ButtonBuilder()
            .setCustomId('get_clue15_role')
            .setLabel('الذهاب الى ملف القضية الخامس عشر')
            .setStyle(ButtonStyle.Primary);
          const row = new ActionRowBuilder().addComponents(button);
          await interaction.reply({ content: MESSAGES.clue15, components: [row], ephemeral: true });
          console.log(`✅ User ${interaction.user.tag} viewed clue 15`);
        },
        get_clue15_role: () => giveRole(interaction, 'clue15', CLUES.clue15.nextChannel),
        
        // Question 1
        show_question1: async () => {
          const btn1 = new ButtonBuilder()
            .setCustomId('q1_answer1')
            .setLabel('الإجابة 1')
            .setStyle(ButtonStyle.Primary);
          const btn2 = new ButtonBuilder()
            .setCustomId('q1_answer2')
            .setLabel('الإجابة 2')
            .setStyle(ButtonStyle.Primary);
          const btn3 = new ButtonBuilder()
            .setCustomId('q1_answer3')
            .setLabel('الإجابة 3')
            .setStyle(ButtonStyle.Primary);
          const btn4 = new ButtonBuilder()
            .setCustomId('q1_answer4')
            .setLabel('الإجابة 4')
            .setStyle(ButtonStyle.Primary);
          
          const row1 = new ActionRowBuilder().addComponents(btn1, btn2);
          const row2 = new ActionRowBuilder().addComponents(btn3, btn4);
          
          const questionText = MESSAGES.question1 + '\n\n' +
            '**1️⃣** أوريون فوس ودّى ليو للجناح عشان يتأكد إن الجهاز لسه شغال وإن الاستجابة القديمة ما زالت موجودة لكنه كان خايف يدخل الجناح بنفسه بسبب اللي حصل سنة 1996\n\n' +
            '**2️⃣** فيكتور هو اللي طلب من ليو يدخل الجناح عشان يستعيد الجهاز ويمنع أي شخص من اكتشاف أسرار التجربة القديمة\n\n' +
            '**3️⃣** أحد أفراد إدارة الأكاديمية أرسل ليو للجناح عشان يتأكد من سبب ظهور العلامة على إيده وعلاقتها بالأحداث الأخيرة\n\n' +
            '**4️⃣** ليو دخل الجناح من نفسه بعد ما سمع صوت غامض بيطلب منه يروح للجهاز';
          
          await interaction.reply({ 
            content: questionText, 
            components: [row1, row2], 
            ephemeral: true 
          });
          console.log(`✅ User ${interaction.user.tag} viewed question 1`);
        },
        
        // Question 1 Answers
        q1_answer1: async () => {
          // Correct answer
          const button = new ButtonBuilder()
            .setCustomId('show_question2')
            .setLabel('السؤال الثاني')
            .setStyle(ButtonStyle.Success);
          const row = new ActionRowBuilder().addComponents(button);
          
          await interaction.reply({
            content: '✅ **إجابة صحيحة!**\n\nأحسنت! أوريون فوس هو من أرسل ليو للجناح الشرقي.\n\nانتقل الآن إلى السؤال التالي.',
            components: [row],
            ephemeral: true
          });
          console.log(`✅ User ${interaction.user.tag} answered Q1 correctly`);
        },
        
        q1_answer2: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q1 wrong (answer 2)`);
        },
        
        q1_answer3: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q1 wrong (answer 3)`);
        },
        
        q1_answer4: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q1 wrong (answer 4)`);
        },
        
        // Question 2
        show_question2: async () => {
          const btn1 = new ButtonBuilder()
            .setCustomId('q2_answer1')
            .setLabel('الإجابة 1')
            .setStyle(ButtonStyle.Primary);
          const btn2 = new ButtonBuilder()
            .setCustomId('q2_answer2')
            .setLabel('الإجابة 2')
            .setStyle(ButtonStyle.Primary);
          const btn3 = new ButtonBuilder()
            .setCustomId('q2_answer3')
            .setLabel('الإجابة 3')
            .setStyle(ButtonStyle.Primary);
          const btn4 = new ButtonBuilder()
            .setCustomId('q2_answer4')
            .setLabel('الإجابة 4')
            .setStyle(ButtonStyle.Primary);
          
          const row1 = new ActionRowBuilder().addComponents(btn1, btn2);
          const row2 = new ActionRowBuilder().addComponents(btn3, btn4);
          
          const questionText = MESSAGES.question2 + '\n\n' +
            '**1️⃣** نعم فيكتور كان عارف إن صوفيا ما زالت حية لكنه أخفى الحقيقة عن الأكاديمية خوفًا من انكشاف التجربة\n\n' +
            '**2️⃣** نعم فيكتور اكتشف بعد سنوات إن وعي صوفيا ما زال موجودًا لكنه قرر عدم البحث عنها أو محاولة إعادتها\n\n' +
            '**3️⃣** لا فيكتور كان يعتقد إن التجربة فشلت وإن صوفيا اختفت أو ماتت ولم يعرف إن استجابتها ما زالت موجودة\n\n' +
            '**4️⃣** فيكتور كان عارف إن صوفيا موجودة لكنه لم يكن يعرف مكانها داخل الجناح الشرقي';
          
          await interaction.reply({ 
            content: questionText, 
            components: [row1, row2], 
            ephemeral: true 
          });
          console.log(`✅ User ${interaction.user.tag} viewed question 2`);
        },
        
        // Question 2 Answers
        q2_answer1: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q2 wrong (answer 1)`);
        },
        
        q2_answer2: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q2 wrong (answer 2)`);
        },
        
        q2_answer3: async () => {
          // Correct answer
          const button = new ButtonBuilder()
            .setCustomId('show_question3')
            .setLabel('السؤال الثالث')
            .setStyle(ButtonStyle.Success);
          const row = new ActionRowBuilder().addComponents(button);
          
          await interaction.reply({
            content: '✅ **إجابة صحيحة!**\n\nأحسنت! فيكتور لم يكن يعلم أن صوفيا ما زالت موجودة.\n\nانتقل الآن إلى السؤال الأخير.',
            components: [row],
            ephemeral: true
          });
          console.log(`✅ User ${interaction.user.tag} answered Q2 correctly`);
        },
        
        q2_answer4: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q2 wrong (answer 4)`);
        },
        
        // Question 3
        show_question3: async () => {
          const btn1 = new ButtonBuilder()
            .setCustomId('q3_answer1')
            .setLabel('الإجابة 1')
            .setStyle(ButtonStyle.Primary);
          const btn2 = new ButtonBuilder()
            .setCustomId('q3_answer2')
            .setLabel('الإجابة 2')
            .setStyle(ButtonStyle.Primary);
          const btn3 = new ButtonBuilder()
            .setCustomId('q3_answer3')
            .setLabel('الإجابة 3')
            .setStyle(ButtonStyle.Primary);
          const btn4 = new ButtonBuilder()
            .setCustomId('q3_answer4')
            .setLabel('الإجابة 4')
            .setStyle(ButtonStyle.Primary);
          
          const row1 = new ActionRowBuilder().addComponents(btn1, btn2);
          const row2 = new ActionRowBuilder().addComponents(btn3, btn4);
          
          const questionText = MESSAGES.question3 + '\n\n' +
            '**1️⃣** صوفيا ماتت داخل معمل الجناح الشرقي بسبب خلل في الجهاز وتم إخفاء جثمانها وسجلات التجربة من إدارة الأكاديمية\n\n' +
            '**2️⃣** صوفيا اختفت أثناء هروبها من الجناح الشرقي بعد ما اكتشفت إن الدكتور فيكتور كان بيجري تجارب غير قانونية على الطلاب\n\n' +
            '**3️⃣** صوفيا موجودة داخل الغرفة 04 في الجزء المخفي من الجناح الشرقي وبعد فشل تجربة نقل الوعي انفصل وعيها عن جسدها وظل متصلًا بنظام الجهاز\n\n' +
            '**4️⃣** صوفيا خرجت من الأكاديمية بعد انتهاء التجربة واختارت عدم العودة أو التواصل مع أي شخص بسبب خوفها من انكشاف ما حدث';
          
          await interaction.reply({ 
            content: questionText, 
            components: [row1, row2], 
            ephemeral: true 
          });
          console.log(`✅ User ${interaction.user.tag} viewed question 3`);
        },
        
        // Question 3 Answers
        q3_answer1: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q3 wrong (answer 1)`);
        },
        
        q3_answer2: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q3 wrong (answer 2)`);
        },
        
        q3_answer3: async () => {
          // Correct answer - Case solved!
          await interaction.reply({
            content: `🎉 **مبروك أيها المحقق ${interaction.user.username}!**\n\n` +
              '✅ **لقد حللت قضية الجناح الشرقي!**\n\n' +
              'أحسنت! لقد كشفت الحقيقة الكاملة:\n' +
              'صوفيا موجودة في الغرفة 04 داخل الجزء المخفي من الجناح الشرقي، ' +
              'وبعد فشل تجربة نقل الوعي انفصل وعيها عن جسدها وظل متصلًا بنظام الجهاز.\n\n' +
              '🏆 **تم إغلاق القضية بنجاح!**',
            ephemeral: true
          });
          console.log(`🎉 User ${interaction.user.tag} SOLVED THE CASE!`);
        },
        
        q3_answer4: async () => {
          await interaction.reply({
            content: '❌ **إجابة خاطئة!**\n\nحاول مرة أخرى. راجع الأدلة بعناية.',
            ephemeral: true
          });
          console.log(`❌ User ${interaction.user.tag} answered Q3 wrong (answer 4)`);
        },
      };
      
      const action = buttonActions[interaction.customId];
      if (action) await action();
    }
  } catch (err) {
    console.error('Error:', err);
  }
});

client.login(TOKEN);
