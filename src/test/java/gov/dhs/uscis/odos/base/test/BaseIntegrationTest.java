package gov.dhs.uscis.odos.base.test;

import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import gov.dhs.uscis.odos.OdosCrrsUiApp;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = OdosCrrsUiApp.class)
@ActiveProfiles("test, no-liquibase")
public abstract class BaseIntegrationTest {

}
