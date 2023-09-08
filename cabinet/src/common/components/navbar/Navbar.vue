<template>
    <ul class="nav pull-right nav">
        <Action2019/>
        <ActionRobbery/>
        <ActionBadge/>
        <Manager/>
        <Restrictions/>
        <InboxBar/>
        <SavedReports/>
        <BalanceBar/>
        <FinanceBar/>
        <Profile/>
    </ul>
</template>

<script>
    import Action2019 from './Action2019.vue'
    import ActionRobbery from './ActionRobbery.vue'
    import ActionBadge from './ActionBadge.vue'
    import Manager from './Manager.vue'
    import Restrictions from './Restrictions.vue'
    import InboxBar from './InboxBar.vue'
    import SavedReports from './SavedReports.vue'
    import BalanceBar from './BalanceBar.vue'
    import FinanceBar from '/FinanceBar.vue'
    import Profile from './Profile.vue'

    let baseComponents = {
        ActionBadge: ActionBadge,
        ActionRobbery: ActionRobbery,
        Action2019: Action2019,
        Manager: Manager,
        Restrictions: Restrictions,
        InboxBar: InboxBar,
        SavedReports: SavedReports,
        BalanceBar: BalanceBar,
        FinanceBar: FinanceBar,
        Profile: Profile
    };

    export default {
        name: 'Navbar',
        components: baseComponents,
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>
